import { BadRequestException } from "@nestjs/common";

export class ViewBadRequestException extends BadRequestException{
    constructor(private _viewName: string, message: any, error: string){
        super(message, error);
    }

    get viewName(){
        return this._viewName;
    }

}