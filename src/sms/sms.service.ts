import { Injectable } from '@nestjs/common';
import { Twilio } from 'twilio';

@Injectable()
export class SmsService {
  private client: Twilio;

  constructor() {
    this.client = new Twilio(
      process.env.TWILIO_ACCOUNT_SID,
      process.env.TWILIO_AUTH_TOKEN,
    );
  }

  async sendSMS(phone: string, message: string) {
    console.log(
      `sms code from ${process.env.TWILIO_PHONE_NUMBER} to ${phone}:${message}`,
    );
    return true;
  }
}
