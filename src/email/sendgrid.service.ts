import { Injectable, HttpService, Res } from '@nestjs/common';
import { MailOptions } from './mail-options';
import * as config from 'src/config.json';
import { MailService } from './mail.service';
import * as sgMail from '@sendgrid/mail';

@Injectable()
export class SendGridService extends MailService {
    private apikey: string;

    constructor(http: HttpService) {
        super(http);
        this.apikey = config.sendgrid.apikey;
    }

    public async addContact(email: string): Promise<boolean> {
        return true;
    }

    public async sendMail(options: MailOptions): Promise<boolean> {
        sgMail.setApiKey(this.apikey);
        const msg = {
            to: options.to,
            from: options.from,
            subject: options.subject,
            html: options.message,
        };
        try {
            let response = await sgMail.send(msg);
            return true;

        } catch (error) {
            console.log(error);
            return false;
        }
    }
}

