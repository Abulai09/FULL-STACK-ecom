export declare class SmsService {
    private client;
    constructor();
    sendSMS(phone: string, message: string): Promise<boolean>;
}
