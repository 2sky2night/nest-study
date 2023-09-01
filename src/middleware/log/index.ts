import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request } from "express";

@Injectable()
export class LogMiddleware implements NestMiddleware {
  use(req: Request, res: any, next: (error?: any) => void) {
    console.log(req.path);
    next()
  }
}