import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

interface JwtPayload {
  sub: number;
  usuario: string;
  nome: string;
  perfil: number;
}

const jwtSecret = process.env.JWT_SECRET || 'dev-secret-change-in-production';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    });
  }

  validate(payload: JwtPayload) {
    return {
      id: payload.sub,
      usuario: payload.usuario,
      nome: payload.nome,
      perfil: payload.perfil,
    };
  }
}
