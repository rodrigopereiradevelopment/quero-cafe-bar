import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsuarioService } from '../modules/usuario/usuario.service';
import { MesaService } from '../modules/mesa/mesa.service';
import { ProdutoService } from '../modules/produto/produto.service';
import { ComandaService } from '../modules/comanda/comanda.service';
import { ComandaItemService } from '../modules/comanda-item/comanda-item.service';

const usuarios = [
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
    nome: 'Garçom',
    usuario: 'garcom',
    senha: 'garcom',
    perfil: 1,
    telefone: '(11) 98888-1111',
    endereco: 'Rua do Garcom, 200 - Vila',
    data_nascimento: '1990-07-22',
    cpf: '987.654.321-00',
  },
  {
    nome: 'Atendente',
    usuario: 'atendente',
    senha: 'atendente',
    perfil: 1,
    telefone: '(11) 97777-2222',
    endereco: 'Rua da Atendente, 300 - Jardim',
    data_nascimento: '1992-11-05',
    cpf: '456.789.123-00',
  },
  {
    nome: 'Rodrigo',
    usuario: 'rodrigo',
    senha: 'rodrigo',
    perfil: 2,
    telefone: '(11) 96666-3333',
    endereco: 'Rua do Cliente, 400 - Bairro',
    data_nascimento: '1995-01-30',
    cpf: '321.654.987-00',
  },
  {
    nome: 'Maria',
    usuario: 'maria',
    senha: 'maria',
    perfil: 2,
    telefone: '(11) 95555-4444',
    endereco: 'Rua da Maria, 500 - Vila Nova',
    data_nascimento: '1988-06-18',
    cpf: '654.321.987-00',
  },
];

const mesas = [
  { qtd_cadeiras: 2 },
  { qtd_cadeiras: 2 },
  { qtd_cadeiras: 3 },
  { qtd_cadeiras: 4 },
  { qtd_cadeiras: 4 },
];

const produtos = [
  // === CAFÉS QUENTES ===
  {
    dsc_produto: 'Expresso Simples',
    valor_unit: 6,
    imagem:
      'https://images.pexels.com/photos/19252265/pexels-photo-19252265.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Expresso Duplo',
    valor_unit: 9,
    imagem:
      'https://images.pexels.com/photos/19252265/pexels-photo-19252265.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Cappuccino',
    valor_unit: 12,
    imagem:
      'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Café com Leite',
    valor_unit: 8,
    imagem:
      'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Latte',
    valor_unit: 13,
    imagem:
      'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Mocha',
    valor_unit: 15,
    imagem:
      'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Macchiato',
    valor_unit: 11,
    imagem:
      'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Café Especial 3WU',
    valor_unit: 14,
    imagem:
      'https://images.pexels.com/photos/19252265/pexels-photo-19252265.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Einspanner',
    valor_unit: 16,
    imagem:
      'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Salted Caramel Latte',
    valor_unit: 16,
    imagem:
      'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Café Canela',
    valor_unit: 10,
    imagem:
      'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=350',
  },

  // === CAFÉS GELADOS ===
  {
    dsc_produto: 'Cold Brew',
    valor_unit: 14,
    imagem:
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Cold Brew com Leite',
    valor_unit: 16,
    imagem:
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Espresso Gelado',
    valor_unit: 10,
    imagem:
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Iced Latte',
    valor_unit: 15,
    imagem:
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&h=350',
  },

  // === FRAPPÉS ===
  {
    dsc_produto: 'Frappé de Café',
    valor_unit: 16,
    imagem:
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Frappé de Caramelo',
    valor_unit: 18,
    imagem:
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Frappé de Chocolate',
    valor_unit: 18,
    imagem:
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Frappé de Matcha',
    valor_unit: 19,
    imagem:
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Frappé Cookies & Cream',
    valor_unit: 20,
    imagem:
      'https://images.pexels.com/photos/2074130/pexels-photo-2074130.jpeg?auto=compress&cs=tinysrgb&h=350',
  },

  // === BEBIDAS NÃO-CAFÉ ===
  {
    dsc_produto: 'Chocolate Quente',
    valor_unit: 12,
    imagem:
      'https://images.pexels.com/photos/33541425/pexels-photo-33541425.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Matcha Latte',
    valor_unit: 15,
    imagem:
      'https://images.pexels.com/photos/33541425/pexels-photo-33541425.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Chá Latte',
    valor_unit: 13,
    imagem:
      'https://images.pexels.com/photos/33541425/pexels-photo-33541425.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Latte de Baunilha',
    valor_unit: 14,
    imagem:
      'https://images.pexels.com/photos/33541425/pexels-photo-33541425.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Hot White Chocolate',
    valor_unit: 15,
    imagem:
      'https://images.pexels.com/photos/33541425/pexels-photo-33541425.jpeg?auto=compress&cs=tinysrgb&h=350',
  },

  // === SUCOS E Beatriz ===
  {
    dsc_produto: 'Suco de Laranja Natural',
    valor_unit: 10,
    imagem:
      'https://images.pexels.com/photos/30900665/pexels-photo-30900665.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Suco de Limão',
    valor_unit: 9,
    imagem:
      'https://images.pexels.com/photos/30900665/pexels-photo-30900665.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Suco de Maracujá',
    valor_unit: 11,
    imagem:
      'https://images.pexels.com/photos/30900665/pexels-photo-30900665.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Suco Detox Verde',
    valor_unit: 14,
    imagem:
      'https://images.pexels.com/photos/30900665/pexels-photo-30900665.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Smoothie de Morango',
    valor_unit: 16,
    imagem:
      'https://images.pexels.com/photos/30900665/pexels-photo-30900665.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Açaí na Tigela',
    valor_unit: 22,
    imagem:
      'https://images.pexels.com/photos/30900665/pexels-photo-30900665.jpeg?auto=compress&cs=tinysrgb&h=350',
  },

  // === REFRIGERANTES E ÁGUA ===
  {
    dsc_produto: 'Água Mineral s/ Gás',
    valor_unit: 5,
    imagem:
      'https://images.pexels.com/photos/1540235/pexels-photo-1540235.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Água Mineral c/ Gás',
    valor_unit: 6,
    imagem:
      'https://images.pexels.com/photos/1540235/pexels-photo-1540235.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Refrigerante Lata',
    valor_unit: 8,
    imagem:
      'https://images.pexels.com/photos/33469209/pexels-photo-33469209.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Soda Italiana',
    valor_unit: 10,
    imagem:
      'https://images.pexels.com/photos/33469209/pexels-photo-33469209.jpeg?auto=compress&cs=tinysrgb&h=350',
  },

  // === LANCHES E SALGADOS ===
  {
    dsc_produto: 'Pão de Queijo',
    valor_unit: 6,
    imagem:
      'https://images.pexels.com/photos/33541425/pexels-photo-33541425.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Coxinha de Frango',
    valor_unit: 8,
    imagem:
      'https://images.pexels.com/photos/6170473/pexels-photo-6170473.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Pastel de Carne',
    valor_unit: 9,
    imagem:
      'https://images.pexels.com/photos/14866635/pexels-photo-14866635.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Pastel de Queijo',
    valor_unit: 9,
    imagem:
      'https://images.pexels.com/photos/14866635/pexels-photo-14866635.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Esfiha de Carne',
    valor_unit: 7,
    imagem:
      'https://images.pexels.com/photos/6170473/pexels-photo-6170473.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Quiche de Frango',
    valor_unit: 12,
    imagem:
      'https://images.pexels.com/photos/6170473/pexels-photo-6170473.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Sanduíche Natural',
    valor_unit: 14,
    imagem:
      'https://images.pexels.com/photos/29747752/pexels-photo-29747752.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Misto Quente',
    valor_unit: 12,
    imagem:
      'https://images.pexels.com/photos/29747752/pexels-photo-29747752.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Croissant c/ Presunto e Queijo',
    valor_unit: 15,
    imagem:
      'https://images.pexels.com/photos/29747752/pexels-photo-29747752.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Wrap de Frango',
    valor_unit: 18,
    imagem:
      'https://images.pexels.com/photos/29747752/pexels-photo-29747752.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Pão na Chapa',
    valor_unit: 7,
    imagem:
      'https://images.pexels.com/photos/3997309/pexels-photo-3997309.png?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Tapioca c/ Queijo',
    valor_unit: 10,
    imagem:
      'https://images.pexels.com/photos/29747752/pexels-photo-29747752.jpeg?auto=compress&cs=tinysrgb&h=350',
  },

  // === DOCES ===
  {
    dsc_produto: 'Bolo de Cenoura c/ Cobertura',
    valor_unit: 10,
    imagem:
      'https://images.pexels.com/photos/5121948/pexels-photo-5121948.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Bolo de Chocolate',
    valor_unit: 11,
    imagem:
      'https://images.pexels.com/photos/5121948/pexels-photo-5121948.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Brownie',
    valor_unit: 12,
    imagem:
      'https://images.pexels.com/photos/5121948/pexels-photo-5121948.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Cookie c/ Gotas de Chocolate',
    valor_unit: 8,
    imagem:
      'https://images.pexels.com/photos/5121948/pexels-photo-5121948.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Croissant Doce c/ Nutella',
    valor_unit: 16,
    imagem:
      'https://images.pexels.com/photos/5121948/pexels-photo-5121948.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Torta de Limão',
    valor_unit: 14,
    imagem:
      'https://images.pexels.com/photos/5121948/pexels-photo-5121948.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Petit Gateau',
    valor_unit: 22,
    imagem:
      'https://images.pexels.com/photos/5121948/pexels-photo-5121948.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Churros c/ Doce de Leite',
    valor_unit: 14,
    imagem:
      'https://images.pexels.com/photos/5121948/pexels-photo-5121948.jpeg?auto=compress&cs=tinysrgb&h=350',
  },

  // === PRATOS PRINCIPAIS ===
  {
    dsc_produto: 'Arroz c/ Feijão e Frango Grelhado',
    valor_unit: 28,
    imagem:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Macarrão à Carbonara',
    valor_unit: 32,
    imagem:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Risoto de Cogumelos',
    valor_unit: 35,
    imagem:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Salada Caesar c/ Frango',
    valor_unit: 26,
    imagem:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Fish & Chips',
    valor_unit: 34,
    imagem:
      'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
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
  let count = existing.data.length;
  for (const data of mesas) {
    if (count >= 5) {
      console.log(`Mesa (${data.qtd_cadeiras} cadeiras) já existe. Pulando.`);
    } else {
      await mesaService.create(data);
      count++;
      console.log(`Mesa (${data.qtd_cadeiras} cadeiras) criada!`);
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
