import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Mesa } from './entities/mesa.entity';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { ListMesaDto } from './dto/list-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { DeleteMesaDto } from './dto/delete-mesa.dto';
import { PaginatedResponse } from '../produto/dto/paginated-response.dto';
import { IMesaOutput } from './interfaces/mesa.interface';

@Injectable()
export class MesaService {
  constructor(
    @InjectRepository(Mesa)
    private readonly mesaRepository: Repository<Mesa>,
  ) {}

  async create(createMesaDto: CreateMesaDto): Promise<IMesaOutput> {
    const mesa = this.mesaRepository.create(createMesaDto);
    return await this.mesaRepository.save(mesa);
  }

  async findAll(
    listMesaDto: ListMesaDto,
  ): Promise<PaginatedResponse<IMesaOutput>> {
    const { skip, take, ...where } = listMesaDto;
    const [data, total] = await this.mesaRepository.findAndCount({
      where,
      skip,
      take,
    });
    return { data, total, skip: skip ?? 0, take: take ?? 20 };
  }

  async findAllForMapa(): Promise<IMesaOutput[]> {
    return await this.mesaRepository.find({
      order: { numero: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Mesa> {
    const mesa = await this.mesaRepository.findOne({ where: { id } });
    if (!mesa) {
      throw new NotFoundException(`Mesa com ID ${id} nao encontrada`);
    }
    return mesa;
  }

  async update(id: number, updateMesaDto: UpdateMesaDto): Promise<IMesaOutput> {
    const mesa = await this.findOne(id);
    Object.assign(mesa, updateMesaDto);
    return await this.mesaRepository.save(mesa);
  }

  async reservar(id: number, nomeCliente: string): Promise<IMesaOutput> {
    const mesa = await this.findOne(id);

    if (mesa.reservado_por) {
      throw new ConflictException(
        `Mesa ${mesa.numero} ja esta reservada por ${mesa.reservado_por}`,
      );
    }

    mesa.reservado_por = nomeCliente;
    mesa.reservado_em = new Date();
    mesa.status = false;

    return await this.mesaRepository.save(mesa);
  }

  async liberar(id: number): Promise<IMesaOutput> {
    const mesa = await this.findOne(id);

    mesa.reservado_por = null;
    mesa.reservado_em = null;
    mesa.status = true;

    return await this.mesaRepository.save(mesa);
  }

  async remove(id: number): Promise<DeleteMesaDto> {
    await this.findOne(id);
    await this.mesaRepository.delete(id);
    return { id };
  }
}
