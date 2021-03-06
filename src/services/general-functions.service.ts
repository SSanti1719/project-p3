import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import twilio from 'twilio';
import {sendgrid, twilio as twilioConfig} from '../config/index.config';
import {html, subject, text} from '../config/utilities';

const smsClient = twilio(twilioConfig.account_sid, twilioConfig.auth_token);

const generator = require('generate-password');
const cryptoJS = require('crypto-js');
const sendMail = require('@sendgrid/mail');

@injectable({scope: BindingScope.TRANSIENT})
export class GeneralFunctionsService {
  constructor(/* Add @inject to inject parameters */) {}

  /*
   * Add service methods here
   */
  /**
   *
   * @returns random password with the package generate-password
   */
  GenerateRandomPassword(): string {
    let password = generator.generate({
      length: 15,
      numbers: true,
    });
    return password;
  }

  /**
   *
   * @param password already password
   * @returns encrypt password
   */
  EncryptPassword(password: string): string {
    let newPassword = cryptoJS.MD5(password).toString();
    return newPassword;
  }

  EmailNotification(data: any, type: string): Promise<any> {
    sendMail.setApiKey(sendgrid.key);

    const {email: from} = sendgrid;

    const msg = {
      from,
      to: data.email,
      subject: subject(type),
      text: text(type),
      html: html(type, data),
    };

    return sendMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
      })
      .catch((error: any) => {
        console.error(error);
      });
  }

  generateCode(type: string) {
    const random = generator.generate({
      length: 8,
      numbers: true,
      uppercase: true,
      lowercase: false,
    });

    const code = `${type}-${random}`;

    return code;
  }

  sendSMS(phone: string, body: string): Promise<any> {
    return smsClient.messages.create({
      from: <string>twilioConfig.phone_number,
      to: phone,
      body,
    });
  }
}
