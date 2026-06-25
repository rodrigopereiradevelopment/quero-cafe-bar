import { IsBoolean, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';
import { ICreateMesaInput } from '../interfaces/mesa.interface';

export class CreateMesaDto implements ICreateMesaInput {
  @IsInt()
  @IsNotEmpty()
  @Min(1)
  qtd_cadeiras: number;

  @IsBoolean()
  @IsOptional()
  status?: boolean;

  @IsInt()
  @IsOptional()
  numero?: number;

  @IsString()
  @IsOptional()
  localizacao?: string;

  @IsInt()
  @IsOptional()
  posicao_x?: number;

  @IsInt()
  @IsOptional()
  posicao_y?: number;
}
