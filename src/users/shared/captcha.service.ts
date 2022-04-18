import { Injectable } from '@nestjs/common';

@Injectable()
export class CaptchaService {
    async verifyCaptcha(captcha: string): Promise<boolean>{
        return true;
    }
}
