import sgMail from '@sendgrid/mail';


sgMail.setApiKey(process.env.SENDGRID_API_KEY!);

const domain = process.env.NEXT_PUBLIC_APP_URL;

export const sendTwoFactorTokenEmail = async(
  email: string,
  token: string
) => {
  const message = {
    to: email,
    from: 'vinogradnik.bessarabii@gmail.com',
    bcc: 'vinogradnik.bessarabii@gmail.com',
    subject: '2FA Code',
    html: `<p>Your 2FA code: ${token}</p>`,  
  };

  try {
    await sgMail.send(message);
  } catch(err) {
    console.error(`Error sending email: ${err}`);
  }

}

export const sendPasswordResetEmail = async (
  email: string,
  token: string,
) => {
  const resetLink = `${domain}/auth/new-password?token=${token}`;

  const message = {
    to: email,
    from: 'vinogradnik.bessarabii@gmail.com',
    bcc: 'vinogradnik.bessarabii@gmail.com',
    subject: 'Reset your password',
    html: `<p>Click <a href=${resetLink}>here</a> to reset password.</p>`,        
  };

  try {
    await sgMail.send(message);
  } catch(err) {
    console.error(`Error sending email: ${err}`);
  }
}

export const sendVerificationEmail = async (
  email: string, 
  token: string
) => {
  const confirmLink = `${domain}/auth/new-verification?token=${token}`;

  const message = {
    to: email,
    from: 'vinogradnik.bessarabii@gmail.com',
    bcc: 'vinogradnik.bessarabii@gmail.com',
    subject: 'Confirm your email',
    html: `<p>Click <a href=${confirmLink}>here</a> to confirm email.</p>`,        
  };

  try {
    await sgMail.send(message);
  } catch(err) {
    console.error(`Error sending email: ${err}`);
  }
}