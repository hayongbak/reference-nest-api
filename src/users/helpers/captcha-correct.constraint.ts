import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import { Injectable} from "@nestjs/common";
import { CaptchaService } from "../shared/captcha.service";


@ValidatorConstraint({name: 'isCaptchaCorrect', async: true })
@Injectable()
export class IsCaptchaCorrectConstraint implements ValidatorConstraintInterface {

    constructor(private captchaService: CaptchaService) { }

    async validate(captcha: string, args: ValidationArguments) {
        let validCaptcha = await this.captchaService.verifyCaptcha(captcha);
        return validCaptcha; 
    }

}

export function IsCaptchaCorrect(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsCaptchaCorrectConstraint
        });
   };
}