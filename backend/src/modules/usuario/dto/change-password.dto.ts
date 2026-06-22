import { IsNotEmpty, IsString } from 'class-validator';

export class ChangePasswordDto {
  @IsString()
  @IsNotEmpty()
  senha_atual: string;

  @IsString()
  @IsNotEmpty()
  nova_senha: string;
}
