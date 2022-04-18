import {registerDecorator, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments} from "class-validator";
import { Injectable} from "@nestjs/common";
import { UserService } from "../shared/user.service";
import { ModuleRef } from "@nestjs/core";


@ValidatorConstraint({name: 'isUniqueProperty', async: true })
@Injectable()
export class IsUniquePropertyConstraint implements ValidatorConstraintInterface {

    private userService: UserService;
    // The ModuleRef makes sure we don't get issues with the order in which class-validator and typeorm are fired
    // It otherwise has lots of errors having to do with the repository not ready to be injected before this constraint is necessary
    constructor(private moduleRef: ModuleRef) { } 
    onModuleInit() {
        this.userService = this.moduleRef.get(UserService);
    }


    async validate(myvalue: string, args: ValidationArguments) {
        if(!myvalue) {return true; } // if the value is empty, I don't want to check and I return true
        let foundUser = await this.userService.doesUserExistWithProperty(myvalue, args.property);
        return !foundUser; // We have a valid state if there is no user!
    }
    

}

export function IsUniqueProperty(validationOptions?: ValidationOptions) {
   return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: IsUniquePropertyConstraint
        });
   };
}