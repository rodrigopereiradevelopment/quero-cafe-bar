import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min, Max } from 'class-validator';

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

  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  skip?: number = 0;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  @Type(() => Number)
  take?: number = 20;
}
