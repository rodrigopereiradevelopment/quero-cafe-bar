import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ListUsuarioDto } from './dto/list-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PaginatedResponse } from '../produto/dto/paginated-response.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioDto: CreateUsuarioDto) {
    const existing = await this.usuarioRepository.findOne({
      where: { usuario: createUsuarioDto.usuario },
    });
    if (existing) {
      throw new ConflictException('Ja existe um usuario com este login');
    }
    const senha = await bcrypt.hash(createUsuarioDto.senha, 10);
    const usuario = this.usuarioRepository.create({
      ...createUsuarioDto,
      senha,
    });
    return await this.usuarioRepository.save(usuario);
  }

  async findAll(
    listUsuarioDto: ListUsuarioDto,
  ): Promise<PaginatedResponse<Usuario>> {
    const { skip, take, ...where } = listUsuarioDto;
    const [data, total] = await this.usuarioRepository.findAndCount({
      where,
      skip,
      take,
    });
    return { data, total, skip: skip ?? 0, take: take ?? 20 };
  }

  async findOne(id: number) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario com ID ${id} nao encontrado`);
    }
    return usuario;
  }

  async findByUsuario(usuario: string) {
    const user = await this.usuarioRepository.findOne({ where: { usuario } });
    if (!user) {
      throw new NotFoundException(`Usuario ${usuario} nao encontrado`);
    }
    return user;
  }

  async findByPerfil(perfil: number) {
    const users = await this.usuarioRepository.find({ where: { perfil } });
    if (users.length === 0) {
      throw new NotFoundException(
        `Nenhum usuario com perfil ${perfil} encontrado`,
      );
    }
    return users;
  }

  async login(usuario: string, senha: string) {
    const user = await this.usuarioRepository.findOne({
      where: { usuario },
    });

    if (!user) {
      throw new UnauthorizedException('Usuario ou senha invalidos');
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Usuario ou senha invalidos');
    }

    return user;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto) {
    if (updateUsuarioDto.usuario) {
      const existing = await this.usuarioRepository.findOne({
        where: { usuario: updateUsuarioDto.usuario },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Ja existe um usuario com este login');
      }
    }
    const usuario = await this.findOne(id);
    if (updateUsuarioDto.senha) {
      updateUsuarioDto.senha = await bcrypt.hash(updateUsuarioDto.senha, 10);
    }
    const updatedUsuario = Object.assign(usuario, updateUsuarioDto);
    return await this.usuarioRepository.save(updatedUsuario);
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.usuarioRepository.delete(id);
    return { id };
  }

  async changePassword(id: number, senhaAtual: string, novaSenha: string) {
    const usuario = await this.usuarioRepository.findOne({ where: { id } });
    if (!usuario) {
      throw new NotFoundException(`Usuario com ID ${id} nao encontrado`);
    }

    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);
    if (!senhaValida) {
      throw new BadRequestException('Senha atual incorreta');
    }

    const hash = await bcrypt.hash(novaSenha, 10);
    usuario.senha = hash;
    return await this.usuarioRepository.save(usuario);
  }
}
