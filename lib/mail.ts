import { CreateEmailResponseSuccess, Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export type SendMail = (
  to: string,
  subject: string,
  body: React.ReactNode
) => Promise<CreateEmailResponseSuccess | null>;

export const sendMail: SendMail = async (to, subject, body) => {
  const { error, data } = await resend.emails.send({
    from: `Mk-1 <${process.env.NEXT_PUBLIC_RESEND_MAIL}>`,
    to,
    subject,
    react: body,
  });

  if (error) {
    throw new Error(error?.message || "Failed to send email");
  }

  return data;
};
