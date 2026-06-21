import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IUsuarioUpdateInput } from '../interfaces/usuario.interface';

export class UpdateUsuarioDto
  extends PartialType(CreateUsuarioDto)
  implements IUsuarioUpdateInput {}
