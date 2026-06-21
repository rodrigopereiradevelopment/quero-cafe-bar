import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Produto } from './entities/produto.entity';
import { CreateProdutoDto } from './dto/create-produto.dto';
import { ListProdutoDto } from './dto/list-produto.dto';
import { UpdateProdutoDto } from './dto/update-produto.dto';
import { DeleteProdutoDto } from './dto/delete-produto.dto';
import { IProdutoOutput } from './interfaces/produto.interface';

@Injectable()
export class ProdutoService {
  constructor(
    @InjectRepository(Produto)
    private readonly produtoRepository: Repository<Produto>,
    private readonly configService: ConfigService,
  ) {}

  async create(createProdutoDto: CreateProdutoDto): Promise<IProdutoOutput> {
    const produto = this.produtoRepository.create(createProdutoDto);
    return await this.produtoRepository.save(produto);
  }

  async findAll(listProdutoDto: ListProdutoDto): Promise<IProdutoOutput[]> {
    return await this.produtoRepository.find({
      where: listProdutoDto,
    });
  }

  async findOne(id: number): Promise<IProdutoOutput> {
    const produto = await this.produtoRepository.findOne({ where: { id } });
    if (!produto) {
      throw new NotFoundException(`Produto com ID ${id} não encontrado`);
    }
    return produto;
  }

  async update(
    id: number,
    updateProdutoDto: UpdateProdutoDto,
  ): Promise<IProdutoOutput> {
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
      throw new NotFoundException('PEXELS_API_KEY não configurada no .env');
    }

    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(query)}&per_page=12`,
      { headers: { Authorization: apiKey } },
    );

    if (!response.ok) {
      throw new NotFoundException('Erro ao buscar imagens no Pexels');
    }

    const data = await response.json();
    const images = data.photos.map((photo: any) => ({
      url: photo.src.medium,
      alt: photo.alt || query,
    }));

    return { images };
  }
}
