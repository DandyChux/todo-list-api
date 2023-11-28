import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
// import { AuthGuard } from '@nestjs/passport';

@Injectable()
// export class JwtAuthGuard extends AuthGuard('jwt') {}
export class JwtAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return !!request.headers.authorization;
  }
}
