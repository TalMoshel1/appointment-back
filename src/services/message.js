import { transporter, createMail } from "../utlis/noadMailer.js";

export async function messageService(name, email, subject, message, to) {
  try {
    const response = await transporter.sendMail(
      createMail(name, email, subject, message, to)
    );
    return response;
  } catch (error) {
    console.log('error: ', error)
    throw new Error({ message: error.message });
  }
}
