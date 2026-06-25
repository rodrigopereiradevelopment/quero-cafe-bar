import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ICreateProdutoInput } from '../interfaces/produto.interface';

export class CreateProdutoDto implements ICreateProdutoInput {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  dsc_produto: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  categoria?: string;

  @IsNumber()
  @IsNotEmpty()
  valor_unit: number;

  @IsString()
  @IsOptional()
  imagem?: string;

  @IsBoolean()
  @IsOptional()
  status?: boolean;
}
