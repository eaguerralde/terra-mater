import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiExceptionResponse } from '../dto/api-exception-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    const exceptionResponse: any = exception.getResponse();
    const apiResponse: ApiExceptionResponse = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      type: exception.name,
      message: exceptionResponse.message || exception.message,
    };

    response.status(status).json(apiResponse);
  }
}
