import crypto from "crypto";
import { v4 as uuidv4 } from "uuid";

import prismadb from "@/lib/prismadb";
import { getVerificationTokenByUserId } from "@/data/verification-token";
import { getPasswordResetTokenByEmail } from "@/data/password-reset-token";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";


export const generateTwoFactorToken = async (email: string) => {
  const token = crypto.randomInt(100_000, 1_000_000).toString();
  // Two Factor Authentication Token expires in 5 minutes
  const expires = new Date(new Date().getTime() + 5 * 60 * 1000);

  const existingToken = await getTwoFactorTokenByEmail(email);

  if (existingToken) {
    await prismadb.twoFactorToken.delete({
      where: { id: existingToken.id }
    });
  }

  const twoFactorToken = await prismadb.twoFactorToken.create({
    data: {
      email,
      token,
      expires
    }
  });

  return twoFactorToken;
}

export const generatePasswordResetToken = async (email: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000); 

  const existingToken = await getPasswordResetTokenByEmail(email);

  if (existingToken) {
    await prismadb.paswordResetToken.delete({
      where: { id: existingToken.id }
    });
  }

  const passwordResetToken = await prismadb.paswordResetToken.create({
    data: {
      email,
      token,
      expires
    }
  });

  return passwordResetToken;
}

export const generateVerificationToken = async (email: string, userId?: string) => {
  const token = uuidv4();
  const expires = new Date(new Date().getTime() + 3600 * 1000);

  if (userId) {

    const existingToken = await getVerificationTokenByUserId(userId);
    
    if (existingToken) {
      await prismadb.verificationToken.delete({
        where: {
          id: existingToken.id,
        },
      });
    }
  }

  const verificationToken = await prismadb.verificationToken.create({
    data: {
      email,
      userId,
      token,
      expires
    }
  });

  return verificationToken;
};