import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflactor: Reflector) {}

  canActivate(context: ExecutionContext) {
    const roles = this.reflactor.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest();
    const accessableForUserAndAdmin = roles.includes('admin') && roles.includes('user');
    const accessableForAdmin = roles.includes('admin') && request.user.sub.admin;
    const accessableForUser = roles.includes('user') && !request.user.sub.admin;
    if(accessableForUserAndAdmin || accessableForAdmin || accessableForUser){
      return true
    }
    return false;
  }
  
}
