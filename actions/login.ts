"use server";

import { AuthError } from "next-auth";
import * as z from "zod";

import { signIn } from "@/auth";
import { LoginSchema } from "@/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { 
  generateVerificationToken,
  generateTwoFactorToken 
} from "@/lib/tokens";
import { 
  sendVerificationEmail,
  sendTwoFactorTokenEmail
} from "@/lib/email";
import prismadb from "@/lib/prismadb";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confimation";
import initTranslations from "@/app/i18n";

export const loginWithGithub = async () => {
  await signIn("github", {redirectTo: "/"})
}

export const login = async (
  values: z.infer<typeof LoginSchema>,
  currentLocale: string,
  callbackUrl?: string | null
) => {
  const { t } = await initTranslations({
    locale: currentLocale,
    namespaces: ['login']
  })
  const validatedFields = LoginSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: t('invalid_fields') };
  }

  const { email, password, code } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { error: t('email_not_exist') }
  }

  if (!existingUser.emailVerified) {
    const verificationToken = await generateVerificationToken(existingUser.email);

    await sendVerificationEmail(
      verificationToken.email,
      verificationToken.token
    );

    return { success: t('conf_email_sent') };
  }

  if (existingUser.isTwoFactorEnabled) {
    if (code) {
      // Verify 2FA code
      const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

      if (!twoFactorToken) {
        return { error: t('invalid_code') };
      }

      if (twoFactorToken.token !== code) {
        return { error: t('invalid_code') };
      }

      const hasExpired = new Date(twoFactorToken.expires) < new Date();

      await prismadb.twoFactorToken.delete({
        where: { id: twoFactorToken.id }
      });

      if (hasExpired) {
        return { error: t('code_exp') };
      }

      const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

      if (existingConfirmation) {
        await prismadb.twoFactorConfirmation.delete({
          where: { id: existingConfirmation.id }
        });
      }

      await prismadb.twoFactorConfirmation.create({
        data: {
          userId: existingUser.id,
        }
      });

    } else {
      const twoFactorToken = await generateTwoFactorToken(existingUser.email);
      await sendTwoFactorTokenEmail(
        twoFactorToken.email,
        twoFactorToken.token,
      );
        
      return { twoFactor: true };
    }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.name) {
        case "CredentialsSignin":
          return { error: t('invalid_cred') }
        default:
          return { error: t('wrong') }
      }
    }

    throw error;
  }
};