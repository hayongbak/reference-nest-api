import { Injectable, HttpService, Res } from '@nestjs/common';
import { MailOptions } from './mail-options';
import { Response } from 'express';
import { join } from 'path';
import * as utf8 from 'utf8';
import * as base64 from 'base-64';
import { map } from 'rxjs/operators';
import * as config from 'src/config.json';

@Injectable()
export abstract class MailService {
    constructor(protected http: HttpService) { }

    public abstract sendMail(options: MailOptions): Promise<boolean>;
    public abstract addContact(email: string): Promise<boolean>;
}

