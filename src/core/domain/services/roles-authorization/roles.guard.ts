import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { USER_TYPES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  matchRoles(roles: number[], userType: number): boolean {
    return roles.includes(userType);
  }

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get(
      USER_TYPES_KEY,
      context.getHandler(),
    );
    if (!requiredRoles) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      return false;
    }

    return requiredRoles.includes(user.userType);
  }
}
