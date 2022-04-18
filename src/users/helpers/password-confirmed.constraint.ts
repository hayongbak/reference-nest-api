
import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import { Injectable } from "@nestjs/common";


@ValidatorConstraint({name: 'isPasswordConfirmed', async: false })
@Injectable()
export class IsPasswordConfirmedConstraint implements ValidatorConstraintInterface {

    validate(propertyValue: string, args: ValidationArguments) {
        return propertyValue === args.object[args.constraints[0]];
    }

  
}

export function IsPasswordConfirmed(otherProperty: string, validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [otherProperty],
            validator: IsPasswordConfirmedConstraint
        });
   };
}