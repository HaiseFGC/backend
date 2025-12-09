import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // --- CORRECCIÓN CRÍTICA PARA GRAPHQL ---
    // En GraphQL, el contexto HTTP es diferente o inexistente en este punto.
    // Si 'request' es undefined, NO hacemos nada y dejamos que GraphQL maneje el error.
    if (!request) {
      return; 
    }

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const messageResponse =
      exception instanceof HttpException
        ? exception.getResponse()
        : 'Error interno del servidor';

    if (status === 500) {
      this.logger.error(
        `Error crítico en ${request.method} ${request.url}`, 
        exception instanceof Error ? exception.stack : exception
      );
    } else {
      this.logger.warn(`Error controlado ${status} en ${request.url}: ${JSON.stringify(messageResponse)}`);
    }

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: typeof messageResponse === 'object' ? messageResponse : { message: messageResponse },
    });
  }
}