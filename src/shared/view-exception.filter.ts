
import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { ViewBadRequestException } from './view-bad-request.exception';

@Catch(HttpException)
export class ViewExceptionFilter implements ExceptionFilter<ViewBadRequestException> {
  catch(exception: ViewBadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    if(request.headers['content-type'] !== "application/x-www-form-urlencoded"){
        response.status(status).json(exception.getResponse());
    } else {
        let errors = { errors: exception.getResponse(), ...request.body};
        response.render(exception.viewName, errors);
        response.status(status);
    } 
  }
}