import { Injectable, HttpService, Res } from '@nestjs/common';
import { MailOptions } from './mail-options';
import { Response } from 'express';
import { join } from 'path';
import * as utf8 from 'utf8';
import * as base64 from 'base-64';
import { map, catchError } from 'rxjs/operators';
import * as config from 'src/config.json';
import { MailService } from './mail.service';
import { Observable, from } from 'rxjs';

@Injectable()
export class SendInBlueService extends MailService {
    private sender: string;
    private apikey: string;

    constructor(http: HttpService) {
        super(http);
        this.sender = "";//config.sendinblue.sender;
        this.apikey = "";//config.sendinblue.apikey;
    }

    public async addContact(email: string): Promise<boolean> {
        let response: any = await this.http.post('https://api.sendinblue.com/v3/contacts', { email }, { headers: { 'api-key': this.apikey }, responseType: 'json' })
        .pipe(
            catchError(error => from([error]))
        ).toPromise();

        return response.status === 201;
    }

    public async sendMail(options: MailOptions): Promise<boolean> {
        let mail = this.createEmailObject(options);
        let response = await this.http.post('https://api.sendinblue.com/v3/smtp/email', mail, { headers: { 'api-key': this.apikey }, responseType: 'json' })
        .pipe(
            catchError(error => from([error]))
        ).toPromise();
        return response.status === 200;
    }
    private createEmailObject(options: MailOptions) {
        return {
            sender: {
                email: this.sender
            },
            to: [
                {
                    email: options.to,
                }
            ],
            subject: options.subject,
            htmlContent: options.message
        }
    }
}

