import {
  Controller,
  Param,
  Post,
  Body,
  Get,
  Patch,
  Delete,
  Query,
  Req,
  ConflictException,
} from '@nestjs/common';
import { Request } from 'express';
import { UsuarioService } from './usuario.service';
import { Public } from '../auth/public.decorator';
import { Roles } from '../auth/roles.decorator';
import { JwtPayload } from '../auth/jwt-payload.interface';
import { LoginDto } from '../auth/dto/login.dto';
import type { IUsuarioOutput } from './interfaces/usuario.interface';
import { PaginatedResponse } from '../produto/dto/paginated-response.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ListUsuarioDto } from './dto/list-usuario.dto';
import { DeleteUsuarioDto } from './dto/delete-usuario.dto';
import { ChangePasswordDto } from './dto/change-password.dto';

@Roles(0)
@Controller('usuario')
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post()
  async create(
    @Body() createUsuarioDto: CreateUsuarioDto,
  ): Promise<IUsuarioOutput> {
    return await this.usuarioService.create(createUsuarioDto);
  }

  @Get()
  async findAll(
    @Query() listUsuarioDto: ListUsuarioDto,
  ): Promise<PaginatedResponse<IUsuarioOutput>> {
    return await this.usuarioService.findAll(listUsuarioDto);
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IUsuarioOutput> {
    return await this.usuarioService.findOne(id);
  }

  @Get('usuario/:usuario')
  async findByUsuario(
    @Param('usuario') usuario: string,
  ): Promise<IUsuarioOutput> {
    return await this.usuarioService.findByUsuario(usuario);
  }

  @Get('perfil/:perfil')
  async findByPerfil(
    @Param('perfil') perfil: number,
  ): Promise<IUsuarioOutput[]> {
    return await this.usuarioService.findByPerfil(perfil);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto): Promise<IUsuarioOutput> {
    const user = await this.usuarioService.login(
      loginDto.usuario,
      loginDto.senha,
    );
    const { senha, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ): Promise<IUsuarioOutput> {
    return await this.usuarioService.update(id, updateUsuarioDto);
  }

  @Patch(':id/change-password')
  async changePassword(
    @Param('id') id: number,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    await this.usuarioService.changePassword(
      id,
      changePasswordDto.senha_atual,
      changePasswordDto.nova_senha,
    );
    return { message: 'Senha alterada com sucesso' };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number,
    @Req() request: Request & { user?: JwtPayload },
  ): Promise<DeleteUsuarioDto> {
    const user = request.user;
    if (user && user.sub === id) {
      throw new ConflictException('Voce nao pode excluir seu proprio usuario');
    }
    return await this.usuarioService.remove(id);
  }
}
