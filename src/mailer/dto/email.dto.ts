import { Address } from "nodemailer/lib/mailer";

export interface sendEmailDto{
    from?: string,
    recipients: string[],
    subject:string
    text:string
}