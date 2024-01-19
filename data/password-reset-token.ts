import prismadb from "@/lib/prismadb";


export const getPasswordResetTokenByToken = async (token: string) => {
  try {
    const passwordResetToken = await prismadb.paswordResetToken.findUnique({
      where: { token }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
}

export const getPasswordResetTokenByEmail = async (email: string) => {
  try {
    const passwordResetToken = await prismadb.paswordResetToken.findFirst({
      where: { email }
    });

    return passwordResetToken;
  } catch {
    return null;
  }
}