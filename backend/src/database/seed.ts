import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsuarioService } from '../modules/usuario/usuario.service';
import { MesaService } from '../modules/mesa/mesa.service';
import { ProdutoService } from '../modules/produto/produto.service';
import { ComandaService } from '../modules/comanda/comanda.service';
import { ComandaItemService } from '../modules/comanda-item/comanda-item.service';

const usuarios = [
  // === ADMIN (0) ===
  {
    nome: 'Administrador',
    usuario: 'admin',
    senha: 'admin',
    perfil: 0,
    telefone: '(11) 99999-0000',
    endereco: 'Rua do Admin, 100 - Centro',
    data_nascimento: '1985-03-15',
    cpf: '123.456.789-00',
  },
  {
    nome: 'Rodrigo Pereira',
    usuario: 'rodrigo',
    senha: 'rodrigo',
    perfil: 0,
    telefone: '(11) 94444-3333',
    endereco: 'Rua do Cliente, 400 - Bairro',
    data_nascimento: '1995-01-30',
    cpf: '321.654.987-00',
  },
  // === ATENDENTES (1) ===
  {
    nome: 'Carlos Silva',
    usuario: 'carlos',
    senha: 'carlos',
    perfil: 1,
    telefone: '(11) 98888-1111',
    endereco: 'Rua das Flores, 200 - Vila',
    data_nascimento: '1990-07-22',
    cpf: '987.654.321-00',
  },
  {
    nome: 'Ana Souza',
    usuario: 'ana',
    senha: 'ana',
    perfil: 1,
    telefone: '(11) 97777-2222',
    endereco: 'Rua da Paz, 300 - Jardim',
    data_nascimento: '1992-11-05',
    cpf: '456.789.123-00',
  },
  {
    nome: 'Pedro Santos',
    usuario: 'pedro',
    senha: 'pedro',
    perfil: 1,
    telefone: '(11) 96666-1111',
    endereco: 'Av. Brasil, 500 - Centro',
    data_nascimento: '1988-03-10',
    cpf: '111.222.333-44',
  },
  {
    nome: 'Juliana Lima',
    usuario: 'juliana',
    senha: 'juliana',
    perfil: 1,
    telefone: '(11) 95555-2222',
    endereco: 'Rua Augusta, 150 - Consolação',
    data_nascimento: '1995-09-18',
    cpf: '222.333.444-55',
  },
  // === CLIENTES (2) ===
  {
    nome: 'Maria Oliveira',
    usuario: 'maria',
    senha: 'maria',
    perfil: 2,
    telefone: '(11) 93333-4444',
    endereco: 'Rua da Maria, 500 - Vila Nova',
    data_nascimento: '1988-06-18',
    cpf: '654.321.987-00',
  },
  {
    nome: 'Lucas Ferreira',
    usuario: 'lucas',
    senha: 'lucas',
    perfil: 2,
    telefone: '(11) 92222-5555',
    endereco: 'Rua Pará, 123 - Vila Mariana',
    data_nascimento: '1993-04-25',
    cpf: '333.444.555-66',
  },
  {
    nome: 'Fernanda Costa',
    usuario: 'fernanda',
    senha: 'fernanda',
    perfil: 2,
    telefone: '(11) 91111-6666',
    endereco: 'Rua Augusta, 789 - Pinheiros',
    data_nascimento: '1991-12-03',
    cpf: '444.555.666-77',
  },
  {
    nome: 'Ana Beatriz Souza',
    usuario: 'anabeatriz',
    senha: 'anabeatriz',
    perfil: 2,
    telefone: '(11) 98888-1010',
    endereco: 'Rua Haddock Lobo, 200 - Cerqueira César',
    data_nascimento: '1996-03-12',
    cpf: '111.222.333-11',
  },
  {
    nome: 'Bruno Carvalho',
    usuario: 'brunoc',
    senha: 'brunoc',
    perfil: 2,
    telefone: '(11) 97777-2020',
    endereco: 'Rua Oscar Freire, 450 - Jardins',
    data_nascimento: '1994-07-28',
    cpf: '222.333.444-22',
  },
  {
    nome: 'Camila Barbosa',
    usuario: 'camilab',
    senha: 'camilab',
    perfil: 2,
    telefone: '(11) 96666-3030',
    endereco: 'Rua Bela Cintra, 320 - Consolação',
    data_nascimento: '1997-11-05',
    cpf: '333.444.555-33',
  },
  {
    nome: 'Diego Martins',
    usuario: 'diego',
    senha: 'diego',
    perfil: 2,
    telefone: '(11) 95555-4040',
    endereco: 'Rua Liberdade, 180 - Liberdade',
    data_nascimento: '1992-09-19',
    cpf: '444.555.666-44',
  },
  {
    nome: 'Elaine Ribeiro',
    usuario: 'elaine',
    senha: 'elaine',
    perfil: 2,
    telefone: '(11) 94444-5050',
    endereco: 'Rua da Consolação, 600 - Consolação',
    data_nascimento: '1990-01-14',
    cpf: '555.666.777-55',
  },
  {
    nome: 'Fábio Gomes',
    usuario: 'fabio',
    senha: 'fabio',
    perfil: 2,
    telefone: '(11) 93333-6060',
    endereco: 'Rua dos Pinheiros, 250 - Pinheiros',
    data_nascimento: '1989-05-22',
    cpf: '666.777.888-66',
  },
  // === BARISTAS (3) ===
  {
    nome: 'Rafael Mendes',
    usuario: 'rafael',
    senha: 'rafael',
    perfil: 3,
    telefone: '(11) 98888-7777',
    endereco: 'Rua dos Cafés, 50 - Centro',
    data_nascimento: '1992-08-14',
    cpf: '555.666.777-88',
  },
  {
    nome: 'Camila Rocha',
    usuario: 'camila',
    senha: 'camila',
    perfil: 3,
    telefone: '(11) 97777-8888',
    endereco: 'Rua Barão, 320 - Liberdade',
    data_nascimento: '1994-02-20',
    cpf: '666.777.888-99',
  },
  {
    nome: 'Thiago Almeida',
    usuario: 'thiago',
    senha: 'thiago',
    perfil: 3,
    telefone: '(11) 96666-9999',
    endereco: 'Rua da Consolação, 450 - Consolação',
    data_nascimento: '1991-06-07',
    cpf: '777.888.999-00',
  },
  // === COZINHEIROS (4) ===
  {
    nome: 'Marcos Vieira',
    usuario: 'marcos',
    senha: 'marcos',
    perfil: 4,
    telefone: '(11) 95555-0000',
    endereco: 'Rua da Cozinha, 80 - Brás',
    data_nascimento: '1987-10-12',
    cpf: '888.999.000-11',
  },
  {
    nome: 'Patrícia Santos',
    usuario: 'patricia',
    senha: 'patricia',
    perfil: 4,
    telefone: '(11) 94444-1111',
    endereco: 'Rua Galvão Bueno, 200 - Liberdade',
    data_nascimento: '1990-05-28',
    cpf: '999.000.111-22',
  },
  {
    nome: 'Bruno Nascimento',
    usuario: 'bruno',
    senha: 'bruno',
    perfil: 4,
    telefone: '(11) 93333-2222',
    endereco: 'Rua das Laranjeiras, 150 - Laranjeiras',
    data_nascimento: '1989-11-09',
    cpf: '000.111.222-33',
  },
];

const mesas = [
  // === BAR/BALCÃO (6 cadeiras) ===
  { qtd_cadeiras: 1, numero: 1, localizacao: 'bar', posicao_x: 80, posicao_y: 60 },
  { qtd_cadeiras: 1, numero: 2, localizacao: 'bar', posicao_x: 160, posicao_y: 60 },
  { qtd_cadeiras: 1, numero: 3, localizacao: 'bar', posicao_x: 240, posicao_y: 60 },
  { qtd_cadeiras: 1, numero: 14, localizacao: 'bar', posicao_x: 120, posicao_y: 82 },
  { qtd_cadeiras: 1, numero: 15, localizacao: 'bar', posicao_x: 190, posicao_y: 82 },
  { qtd_cadeiras: 1, numero: 16, localizacao: 'bar', posicao_x: 260, posicao_y: 82 },
  // === SALÃO (8 mesas) ===
  { qtd_cadeiras: 2, numero: 4, localizacao: 'salao', posicao_x: 80, posicao_y: 180 },
  { qtd_cadeiras: 2, numero: 5, localizacao: 'salao', posicao_x: 200, posicao_y: 180 },
  { qtd_cadeiras: 4, numero: 6, localizacao: 'salao', posicao_x: 340, posicao_y: 180 },
  { qtd_cadeiras: 2, numero: 7, localizacao: 'salao', posicao_x: 80, posicao_y: 280 },
  { qtd_cadeiras: 3, numero: 8, localizacao: 'salao', posicao_x: 200, posicao_y: 280 },
  { qtd_cadeiras: 4, numero: 9, localizacao: 'salao', posicao_x: 340, posicao_y: 280 },
  { qtd_cadeiras: 4, numero: 17, localizacao: 'salao', posicao_x: 100, posicao_y: 270 },
  { qtd_cadeiras: 4, numero: 18, localizacao: 'salao', posicao_x: 290, posicao_y: 270 },
  // === EXTERNA (4 mesas) ===
  { qtd_cadeiras: 2, numero: 10, localizacao: 'externa', posicao_x: 80, posicao_y: 400 },
  { qtd_cadeiras: 2, numero: 11, localizacao: 'externa', posicao_x: 200, posicao_y: 400 },
  { qtd_cadeiras: 4, numero: 12, localizacao: 'externa', posicao_x: 340, posicao_y: 400 },
  { qtd_cadeiras: 4, numero: 13, localizacao: 'externa', posicao_x: 460, posicao_y: 400 },
];

const produtos = [
  // === CAFÉS QUENTES ===
  { dsc_produto: 'Expresso Simples', categoria: 'Cafés Quentes', valor_unit: 6, imagem: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400' },
  { dsc_produto: 'Expresso Duplo', categoria: 'Cafés Quentes', valor_unit: 9, imagem: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400' },
  { dsc_produto: 'Cappuccino', categoria: 'Cafés Quentes', valor_unit: 12, imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
  { dsc_produto: 'Café com Leite', categoria: 'Cafés Quentes', valor_unit: 8, imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
  { dsc_produto: 'Latte', categoria: 'Cafés Quentes', valor_unit: 13, imagem: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
  { dsc_produto: 'Mocha', categoria: 'Cafés Quentes', valor_unit: 15, imagem: 'https://images.unsplash.com/photo-1578314675249-a6910f80cc4e?w=400' },
  { dsc_produto: 'Macchiato', categoria: 'Cafés Quentes', valor_unit: 11, imagem: 'https://images.unsplash.com/photo-1485808191679-5f86510681a2?w=400' },
  { dsc_produto: 'Café Especial 3WU', categoria: 'Cafés Quentes', valor_unit: 14, imagem: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400' },
  { dsc_produto: 'Einspanner', categoria: 'Cafés Quentes', valor_unit: 16, imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
  { dsc_produto: 'Salted Caramel Latte', categoria: 'Cafés Quentes', valor_unit: 16, imagem: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
  { dsc_produto: 'Café Canela', categoria: 'Cafés Quentes', valor_unit: 10, imagem: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400' },

  // === CAFÉS GELADOS ===
  { dsc_produto: 'Cold Brew', categoria: 'Cafés Gelados', valor_unit: 14, imagem: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
  { dsc_produto: 'Cold Brew com Leite', categoria: 'Cafés Gelados', valor_unit: 16, imagem: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
  { dsc_produto: 'Espresso Gelado', categoria: 'Cafés Gelados', valor_unit: 10, imagem: 'https://images.unsplash.com/photo-1510707577719-ae7c14805e3a?w=400' },
  { dsc_produto: 'Iced Latte', categoria: 'Cafés Gelados', valor_unit: 15, imagem: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },

  // === FRAPPÉS ===
  { dsc_produto: 'Frappé de Café', categoria: 'Frappés', valor_unit: 16, imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
  { dsc_produto: 'Frappé de Caramelo', categoria: 'Frappés', valor_unit: 18, imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
  { dsc_produto: 'Frappé de Chocolate', categoria: 'Frappés', valor_unit: 18, imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },
  { dsc_produto: 'Frappé de Matcha', categoria: 'Frappés', valor_unit: 19, imagem: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400' },
  { dsc_produto: 'Frappé Cookies & Cream', categoria: 'Frappés', valor_unit: 20, imagem: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400' },

  // === BEBIDAS NÃO-CAFÉ ===
  { dsc_produto: 'Chocolate Quente', categoria: 'Bebidas', valor_unit: 12, imagem: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400' },
  { dsc_produto: 'Matcha Latte', categoria: 'Bebidas', valor_unit: 15, imagem: 'https://images.unsplash.com/photo-1515823064-d6e0c04616a7?w=400' },
  { dsc_produto: 'Chá Latte', categoria: 'Bebidas', valor_unit: 13, imagem: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400' },
  { dsc_produto: 'Latte de Baunilha', categoria: 'Bebidas', valor_unit: 14, imagem: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=400' },
  { dsc_produto: 'Hot White Chocolate', categoria: 'Bebidas', valor_unit: 15, imagem: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=400' },

  // === SUCOS EBeatriz ===
  { dsc_produto: 'Suco de Laranja Natural', categoria: 'Sucos', valor_unit: 10, imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
  { dsc_produto: 'Suco de Limão', categoria: 'Sucos', valor_unit: 9, imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
  { dsc_produto: 'Suco de Maracujá', categoria: 'Sucos', valor_unit: 11, imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
  { dsc_produto: 'Suco Detox Verde', categoria: 'Sucos', valor_unit: 14, imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
  { dsc_produto: 'Smoothie de Morango', categoria: 'Sucos', valor_unit: 16, imagem: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400' },
  { dsc_produto: 'Açaí na Tigela', categoria: 'Sucos', valor_unit: 22, imagem: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400' },

  // === REFRIGERANTES E ÁGUA ===
  { dsc_produto: 'Água Mineral s/ Gás', categoria: 'Bebidas', valor_unit: 5, imagem: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400' },
  { dsc_produto: 'Água Mineral c/ Gás', categoria: 'Bebidas', valor_unit: 6, imagem: 'https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400' },
  { dsc_produto: 'Refrigerante Lata', categoria: 'Bebidas', valor_unit: 8, imagem: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' },
  { dsc_produto: 'Soda Italiana', categoria: 'Bebidas', valor_unit: 10, imagem: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400' },

  // === LANCHES E SALGADOS ===
  { dsc_produto: 'Pão de Queijo', categoria: 'Lanches', valor_unit: 6, imagem: 'https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400' },
  { dsc_produto: 'Coxinha de Frango', categoria: 'Lanches', valor_unit: 8, imagem: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400' },
  { dsc_produto: 'Pastel de Carne', categoria: 'Lanches', valor_unit: 9, imagem: 'https://images.unsplash.com/photo-1606525437679-05b9193e16e7?w=400' },
  { dsc_produto: 'Pastel de Queijo', categoria: 'Lanches', valor_unit: 9, imagem: 'https://images.unsplash.com/photo-1606525437679-05b9193e16e7?w=400' },
  { dsc_produto: 'Esfiha de Carne', categoria: 'Lanches', valor_unit: 7, imagem: 'https://images.unsplash.com/photo-1606525437679-05b9193e16e7?w=400' },
  { dsc_produto: 'Quiche de Frango', categoria: 'Lanches', valor_unit: 12, imagem: 'https://images.unsplash.com/photo-1527515545241-17d2f0f8a2a4?w=400' },
  { dsc_produto: 'Sanduíche Natural', categoria: 'Lanches', valor_unit: 14, imagem: 'https://images.unsplash.com/photo-1553909489-cd47e0907980?w=400' },
  { dsc_produto: 'Misto Quente', categoria: 'Lanches', valor_unit: 12, imagem: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400' },
  { dsc_produto: 'Croissant c/ Presunto e Queijo', categoria: 'Lanches', valor_unit: 15, imagem: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400' },
  { dsc_produto: 'Wrap de Frango', categoria: 'Lanches', valor_unit: 18, imagem: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=400' },
  { dsc_produto: 'Pão na Chapa', categoria: 'Lanches', valor_unit: 7, imagem: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400' },
  { dsc_produto: 'Tapioca c/ Queijo', categoria: 'Lanches', valor_unit: 10, imagem: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },

  // === DOCES ===
  { dsc_produto: 'Bolo de Cenoura c/ Cobertura', categoria: 'Doces', valor_unit: 10, imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
  { dsc_produto: 'Bolo de Chocolate', categoria: 'Doces', valor_unit: 11, imagem: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400' },
  { dsc_produto: 'Brownie', categoria: 'Doces', valor_unit: 12, imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400' },
  { dsc_produto: 'Cookie c/ Gotas de Chocolate', categoria: 'Doces', valor_unit: 8, imagem: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400' },
  { dsc_produto: 'Croissant Doce c/ Nutella', categoria: 'Doces', valor_unit: 16, imagem: 'https://images.unsplash.com/photo-1555507036-ab1f4038024a?w=400' },
  { dsc_produto: 'Torta de Limão', categoria: 'Doces', valor_unit: 14, imagem: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=400' },
  { dsc_produto: 'Petit Gateau', categoria: 'Doces', valor_unit: 22, imagem: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400' },
  { dsc_produto: 'Churros c/ Doce de Leite', categoria: 'Doces', valor_unit: 14, imagem: 'https://images.unsplash.com/photo-1624371414361-e670edf4e838?w=400' },

  // === PRATOS PRINCIPAIS ===
  { dsc_produto: 'Arroz c/ Feijão e Frango Grelhado', categoria: 'Pratos', valor_unit: 28, imagem: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400' },
  { dsc_produto: 'Macarrão à Carbonara', categoria: 'Pratos', valor_unit: 32, imagem: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400' },
  { dsc_produto: 'Risoto de Cogumelos', categoria: 'Pratos', valor_unit: 35, imagem: 'https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400' },
  { dsc_produto: 'Salada Caesar c/ Frango', categoria: 'Pratos', valor_unit: 26, imagem: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400' },
  { dsc_produto: 'Fish & Chips', categoria: 'Pratos', valor_unit: 34, imagem: 'https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?w=400' },
];

async function seedUsuarios(usuarioService: UsuarioService) {
  for (const data of usuarios) {
    try {
      await usuarioService.findByUsuario(data.usuario);
      console.log(`Usuário ${data.usuario} já existe. Pulando.`);
    } catch {
      await usuarioService.create(data);
      console.log(`Usuário ${data.usuario} criado com sucesso!`);
    }
  }
}

async function seedMesas(mesaService: MesaService) {
  const existing = await mesaService.findAll({});
  for (const data of mesas) {
    const existente = existing.data.find((m) => m.numero === data.numero);
    if (existente) {
      // Atualiza posicao se nao tiver
      if (!existente.posicao_x && data.posicao_x) {
        await mesaService.update(existente.id, {
          posicao_x: data.posicao_x,
          posicao_y: data.posicao_y,
          localizacao: data.localizacao,
          qtd_cadeiras: data.qtd_cadeiras,
        });
        console.log(`Mesa ${data.numero} atualizada com posicao!`);
      } else {
        console.log(`Mesa ${data.numero} já existe. Pulando.`);
      }
    } else {
      await mesaService.create(data);
      console.log(`Mesa ${data.numero} criada!`);
    }
  }
}

async function seedProdutos(produtoService: ProdutoService) {
  const existing = await produtoService.findAll({});
  for (const data of produtos) {
    const existente = existing.data.find((p) => p.dsc_produto === data.dsc_produto);
    if (existente) {
      if (!existente.imagem && data.imagem) {
        await produtoService.update(existente.id, { imagem: data.imagem });
        console.log(`Produto ${data.dsc_produto} atualizado com imagem!`);
      } else {
        console.log(`Produto ${data.dsc_produto} já existe. Pulando.`);
      }
    } else {
      await produtoService.create(data);
      console.log(`Produto ${data.dsc_produto} criado!`);
    }
  }
}

async function seedComandaExemplo(
  comandaService: ComandaService,
  comandaItemService: ComandaItemService,
  produtoService: ProdutoService,
) {
  try {
    await comandaService.findOneByMesaId(2);
    console.log('Comanda de exemplo já existe. Pulando.');
    return;
  } catch {
    // não existe, criar
  }

  const produtosDB = await produtoService.findAll({});
  const findProduto = (nome: string) =>
    produtosDB.data.find((p) => p.dsc_produto === nome);

  const comanda = await comandaService.create({
    id_mesa: 2,
    obs_comanda: 'Cliente: Rodrigo',
  });
  console.log(`Comanda de exemplo criada (ID ${comanda.id})!`);

  const coxinha = findProduto('Coxinha');
  const cafe = findProduto('Café Expresso');
  const cappuccino = findProduto('Cappuccino');

  if (coxinha) {
    await comandaItemService.create({
      id_comanda: comanda.id,
      id_produto: coxinha.id,
      qtd_item: 1,
      valor_venda: coxinha.valor_unit,
    });
    console.log('  → 1 Coxinha');
  }
  if (cafe) {
    await comandaItemService.create({
      id_comanda: comanda.id,
      id_produto: cafe.id,
      qtd_item: 1,
      valor_venda: cafe.valor_unit,
    });
    console.log('  → 1 Café Expresso');
  }
  if (cappuccino) {
    await comandaItemService.create({
      id_comanda: comanda.id,
      id_produto: cappuccino.id,
      qtd_item: 1,
      valor_venda: cappuccino.valor_unit,
    });
    console.log('  → 1 Cappuccino');
  }
}

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usuarioService = app.get(UsuarioService);
  const mesaService = app.get(MesaService);
  const produtoService = app.get(ProdutoService);
  const comandaService = app.get(ComandaService);
  const comandaItemService = app.get(ComandaItemService);

  try {
    console.log('\n=== Usuários ===');
    await seedUsuarios(usuarioService);

    console.log('\n=== Mesas ===');
    await seedMesas(mesaService);

    console.log('\n=== Produtos ===');
    await seedProdutos(produtoService);

    console.log('\n=== Comanda de Exemplo ===');
    await seedComandaExemplo(
      comandaService,
      comandaItemService,
      produtoService,
    );

    console.log('\n✅ Seed concluído com sucesso!');
  } catch (err) {
    console.error('Erro no seed:', err);
  }

  await app.close();
}

seed().catch((err) => {
  console.error('Erro fatal no seed:', err);
  process.exit(1);
});
