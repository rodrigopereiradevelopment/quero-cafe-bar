import {
  ConflictException,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { ListProdutoDto } from './dto/list-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { DeleteProdutoDto } from './dto/delete-produto.dto';
import { PaginatedResponse } from './dto/paginated-response.dto';
import { IProdutoOutput } from './interfaces/produto.interface';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    private readonly configService: ConfigService,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<IProdutoOutput> {
    const existing = await this.produtoRepository.findOne({
      where: { dsc_produto: createProdutoDto.dsc_produto },
    });
    if (existing) {
      throw new ConflictException('Ja existe um produto com esta descricao');
    }
    const produto = this.produtoRepository.create(createProdutoDto);
    return await this.produtoRepository.save(produto);
  }

  async findAll(
    listProdutoDto: ListProdutoDto,
  ): Promise<PaginatedResponse<IProdutoOutput>> {
    const { skip, take, ...where } = listProdutoDto;
    const [data, total] = await this.produtoRepository.findAndCount({
      where,
      skip,
      take,
    });
    return { data, total, skip: skip ?? 0, take: take ?? 20 };
  }

  async findOne(id: number): Promise<IProdutoOutput> {
    const produto = await this.produtoRepository.findOne({ where: { id } });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} nao encontrado`);
    }
    return produto;
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<IProdutoOutput> {
    if (updateProdutoDto.dsc_produto) {
      const existing = await this.produtoRepository.findOne({
        where: { dsc_produto: updateProdutoDto.dsc_produto },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('Ja existe um produto com esta descricao');
      }
    }
    const produto = await this.findOne(id);
    const updatedProduto = Object.assign(produto, updateProdutoDto);
    return await this.produtoRepository.save(updatedProduto);
  }

  async remove(id: number): Promise<DeleteProdutoDto> {
    await this.findOne(id);
    await this.produtoRepository.delete(id);
    return { id };
  }

  async buscarImagemPexels(
    query: string,
  ): Promise<{ images: { url: string; alt: string }[] }> {
    const apiKey = this.configService.get<string>('PEXELS_API_KEY');
    if (!apiKey) {
      throw new InternalServerErrorException('PEXELS_API_KEY nao configurada no .env');
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`,
      { headers: { Authorization: apiKey } },
    );

    if (!response.ok) {
      throw new InternalServerErrorException('Erro ao buscar imagens no Pexels');
    }

    const data = await response.json();
    const images = data.photos.map((photo: any) => ({
      url: photo.src.medium,
      alt: photo.alt || query,
    }));

    return { images };
  }
}
