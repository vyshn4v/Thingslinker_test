import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { sendEmailDto } from './dto';
import Mail from 'nodemailer/lib/mailer';
@Injectable()
export class MailerService {
  constructor(private configService: ConfigService) {}

  mailTransport() {
    const transporter = nodemailer.createTransport({
      host: this.configService.get<string>('MAIL_HOST'),
      port: this.configService.get<number>('MAIL_PORT'),
      secure: this.configService.get<boolean>('MAIL_SECURE'),
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASSWORD'),
      },
    });
    return transporter;
  }

  async sendEmail(emailDto: sendEmailDto) {
    const {from,recipients,subject,text,html}=emailDto
    const transport = this.mailTransport();
    const options :Mail.Options={
        from:from ?? this.configService.get('MAIL_USER'),
        to:recipients,
        subject,
        text,
        html
    }

    try{
        const mailStatus=await transport.sendMail(options)
        return mailStatus
    }catch(error){

    }
  }

  
}
