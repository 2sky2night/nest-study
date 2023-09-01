import { Injectable, NestMiddleware } from "@nestjs/common";

export function TestMiddleware(req: any, res: any, next: () => void) {
  console.log('ok');
  next()
}