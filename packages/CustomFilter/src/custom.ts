import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  ForbiddenException,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnauthorizedException,
  WsExceptionFilter,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { WsException } from "@nestjs/websockets";

type type = "SUCCESS" | "ERROR" | "WARNING" | "WAIT";
interface response {
  message: string;
  data?: any;
  type?: type;
  timestamp?: string;
  statusCode?: number | undefined;
}
interface responseIO {
  message: string;
  data?: any;
  type?: type;
  timestamp?: string;
}

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse();
    const httpAdapter = this.httpAdapterHost.httpAdapter;
    let response: response = {
      message: exception.message,
      type: "WARNING",
      timestamp: new Date().toISOString(),
    };
    if (exception instanceof UnauthorizedException) {
      const json = JSON.parse(JSON.stringify(exception.getResponse()));
      response.message = Array.isArray(json?.message)
        ? json?.message[0]
        : json?.message;
      response.type = "ERROR";
      response.statusCode = 401;
    }
    if (exception instanceof ForbiddenException) {
      const json = JSON.parse(JSON.stringify(exception.getResponse()));
      response.message = Array.isArray(json?.message)
        ? json?.message[0]
        : json?.message;
      response.type = "ERROR";
      response.statusCode = 403;
    }
    if (exception instanceof NotFoundException) {
      response.message = "ไม่พบหน้า";
      response.statusCode = 404;
      response.type = "ERROR";
    }
    if (
      exception instanceof TypeError ||
      exception instanceof InternalServerErrorException ||
      (exception instanceof Error &&
        !(
          exception instanceof HTTPException ||
          exception instanceof NotFoundException ||
          exception instanceof UnauthorizedException ||
          exception instanceof ForbiddenException
        ))
    ) {
      response.message = "เกิดข้อผิดพลาดบางอย่างที่ไม่สามารถระบุได้";
      response.statusCode = 500;
      response.type = "ERROR";
      Logger.error(exception.message, exception.stack, "AllExceptionsFilter");
    }
    if (exception instanceof HTTPException) {
      response.message = exception.message;
      response.statusCode = exception.status;
      response.type = exception.type;
    }
    httpAdapter.reply(
      ctx.getResponse(),
      {
        message: response.message,
        data: response?.data,
        type: response.type,
        timestamp: response.timestamp,
      },
      response?.statusCode ?? 400
    );
  }
}

export class HTTPException extends Error {
  public readonly status: number;
  public readonly type: type;
  constructor(res: response) {
    super();
    this.status = res.statusCode ?? 400;
    this.message = res.message;
    this.type = res.type ?? "ERROR";
  }
}
@Catch(WsException)
export class AllWsExceptionsFilter implements WsExceptionFilter {
  catch(exception: WSException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const data = exception.getError();
    let response: responseIO = {
      message: exception.message,
      type: "WARNING",
      timestamp: new Date().toISOString(),
    };
    response.message = data.message;
    response.type = data.type;
    client.emit("MsgError", {
      message: response.message,
      data: response.data,
      type: response.type,
      timestamp: response.timestamp,
    });
  }
}

export class WSException extends Error {
  public readonly type: type;
  constructor(res: responseIO) {
    super();
    this.message = res.message;
    this.type = res.type ?? "ERROR";
  }
  initMessage(): void {
    this.message = this.message as string;
  }
  getError(): responseIO {
    return {
      message: this.message,
      type: this.type,
    };
  }
}
