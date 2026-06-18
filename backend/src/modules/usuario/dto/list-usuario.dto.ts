import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class ListUsuarioDto {
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  id?: number;

  @IsString()
  @IsOptional()
  nome?: string;

  @IsString()
  @IsOptional()
  usuario?: string;

  @Type(() => Number)
  @IsInt()
  @IsOptional()
  perfil?: number;
}
