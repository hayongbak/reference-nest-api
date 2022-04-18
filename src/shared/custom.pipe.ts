import { ValidationPipe, ArgumentMetadata, Injectable, SetMetadata, BadRequestException } from '@nestjs/common';
import { ValidatorOptions } from 'class-validator';
import { ViewBadRequestException } from './view-bad-request.exception';


@Injectable()
export class SkipProperties extends ValidationPipe {
    constructor() {
        super({
            skipMissingProperties: true
        });
    }
}

@Injectable()
export class NormalPipe extends ValidationPipe {
    constructor() {
        super({
            transform: true,
            forbidUnknownValues: true,
            validationError: { target: false }
        });
    }
}

@Injectable()
export class NormalPipeWithView extends NormalPipe{
    constructor(private viewName: string) {
        super();
    }

    public async transform(value: any, metadata: ArgumentMetadata): Promise<any>{
        try{
            let response =  await super.transform(value, metadata);
            return response;
        }catch(bre){
            if(bre instanceof BadRequestException){
                throw new ViewBadRequestException(this.viewName, bre.getResponse(), `${bre.getStatus()}`);
            }
        }
    }
}

