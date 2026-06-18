import { PartialType } from '@nestjs/mapped-types';
import { CreateMesaDto } from './create-mesa.dto';
import { IUpdateMesaInput } from '../interfaces/mesa.interface';

export class UpdateMesaDto
  extends PartialType(CreateMesaDto)
  implements IUpdateMesaInput
{} // id vem da URL, não precisa validar no body
