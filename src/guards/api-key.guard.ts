import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  private readonly expectedToken = this.configService.get<string>('EMAIL_KEY');

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<Request>();

    // Intentamos obtener el token desde el header o desde el body
    const tokenFromHeader = request.headers['key'];
    const tokenFromBody = request.body?.key;

    const token = tokenFromHeader || tokenFromBody;

    if (!token || token !== this.expectedToken) {
      throw new UnauthorizedException('Token inválido o no enviado');
    }

    return true;
  }
}
