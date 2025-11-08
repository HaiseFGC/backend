// src/infrastructure/guards/jwt-auth.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    // Esto permite que el guard funcione tanto para REST API como para GraphQL
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}