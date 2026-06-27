import { Controller } from '@nestjs/common';
import { MesaService } from './mesa.service';
import { CreateMesaDto } from './dto/create-mesa.dto';
import { ListMesaDto } from './dto/list-mesa.dto';
import { UpdateMesaDto } from './dto/update-mesa.dto';
import { DeleteMesaDto } from './dto/delete-mesa.dto';
import { PaginatedResponse } from '../produto/dto/paginated-response.dto';
import { IMesaOutput } from './interfaces/mesa.interface';
import { Body, Get, Param, Patch, Post, Query, Delete } from '@nestjs/common';
import { Roles } from '../auth/roles.decorator';

@Roles(0, 1)
@Controller('mesa')
export class MesaController {
  constructor(private readonly mesaService: MesaService) {}

  @Post()
  async create(@Body() createMesaDto: CreateMesaDto): Promise<IMesaOutput> {
    return await this.mesaService.create(createMesaDto);
  }

  @Get()
  async findAll(
    @Query() listMesaDto: ListMesaDto,
  ): Promise<PaginatedResponse<IMesaOutput>> {
    return await this.mesaService.findAll(listMesaDto);
  }

  @Get('mapa')
  async findAllForMapa(): Promise<IMesaOutput[]> {
    return await this.mesaService.findAllForMapa();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<IMesaOutput> {
    return await this.mesaService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateMesaDto: UpdateMesaDto,
  ): Promise<IMesaOutput> {
    return await this.mesaService.update(id, updateMesaDto);
  }

  @Patch(':id/reservar')
  async reservar(
    @Param('id') id: number,
    @Body('nome_cliente') nomeCliente: string,
  ): Promise<IMesaOutput> {
    return await this.mesaService.reservar(id, nomeCliente);
  }

  @Patch(':id/liberar')
  async liberar(@Param('id') id: number): Promise<IMesaOutput> {
    return await this.mesaService.liberar(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<DeleteMesaDto> {
    return await this.mesaService.remove(id);
  }
}
