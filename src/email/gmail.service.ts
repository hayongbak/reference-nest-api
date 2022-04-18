import { Injectable, HttpService, Res } from '@nestjs/common';
import { MailOptions } from './mail-options';
import { Response } from 'express';
import { join } from 'path';
import * as utf8 from 'utf8';
import * as base64 from 'base-64';
import { map } from 'rxjs/operators';
import * as config from 'src/config.json';
import { MailService } from './mail.service';

@Injectable()
export class GMailService extends MailService {

    public async addContact(email: string): Promise<boolean>{
        return true;
    }


    public async sendMail(options: MailOptions): Promise<boolean> {
        let mailContent = this.createRawMailForGmail(options);
        var bytes = utf8.encode(mailContent);
        var rawMessage = base64.encode(bytes);
        let { sender, apikey } = {sender: "dm@gaimer.dev", apikey: "test"};
        // We also need an OAuth2.0 Token which needs to be refreshed every 30 days - that's why I don't want to use it. Letting it stay in here for future reference.

        let returnValue = await this.http.post(`https://www.googleapis.com/gmail/v1/users/${sender}/messages/send?alt=json&prettyPrint=true&key=${apikey}`, {
            raw: rawMessage
        }).pipe(
            // map(
            //     resp => resp.data
            //     )
        ).toPromise();
        return true;


    }

    private createRawMailForGmail(options: MailOptions): string {
        let { to, from, subject, message } = options;
        // DO NOT ADD WHITESPACE IN FRONT OF THESE LINES!
        let mailContent = `Content-Type: text/plain; charset="UTF-8"
MIME-Version: 1.0
Content-Transfer-Encoding: 7bit
to: ${to}
from: ${from}
subject: ${subject}

${message}`;

        return mailContent;
    }
}

