import { config } from "dotenv";
import nodemailer, { Transporter } from "nodemailer";
import hbs from "nodemailer-express-handlebars";
import { Readable } from "nodemailer/lib/xoauth2";

config();

interface ITransporter {
  service: string;
  auth: {
    user: string;
    pass: string;
  };
  secure: boolean;
}

interface ISender {
  name: string;
}

interface IReceiver {
  email: string | string[];
}

interface IMailContent {
  subject: string;
  text: string;
  html: string | Buffer | Readable;
}

export class Email {
  createTransporter(transporter: ITransporter): Transporter {
    return nodemailer.createTransport(transporter);
  }

  async sendMail(
    sender: ISender,
    receiver: IReceiver,
    mailContent: IMailContent
  ): Promise<void> {
    const transporter = this.createTransporter({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      secure: true,
    });

    await transporter.sendMail({
      from: sender.name,
      to: receiver.email,
      subject: mailContent.subject,
      text: mailContent.text,
      html: mailContent.html,
    });
  }

  async forgotPassword() {
    const transporter = this.createTransporter({
      service: "Gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
      },
      secure: true,
    });

    const handlebarOptions = {
      viewEngine: {
        extName: ".html",
        partialsDir: `${__dirname}/resources`,
        layoutsDir: `${__dirname}/resources`,
      },
      viewPath: `${__dirname}/resources`,
      extName: ".html",
    };

    transporter.use("compile", hbs(handlebarOptions));
  }
}
