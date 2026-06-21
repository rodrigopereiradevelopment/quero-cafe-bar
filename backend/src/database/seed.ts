import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsuarioService } from '../modules/usuario/usuario.service';
import { MesaService } from '../modules/mesa/mesa.service';
import { ProdutoService } from '../modules/produto/produto.service';
import { ComandaService } from '../modules/comanda/comanda.service';
import { ComandaItemService } from '../modules/comanda-item/comanda-item.service';

const usuarios = [
  { nome: 'Administrador', usuario: 'admin', senha: 'admin', perfil: 0 },
  { nome: 'Garçom', usuario: 'garcom', senha: 'garcom', perfil: 1 },
  { nome: 'Atendente', usuario: 'atendente', senha: 'atendente', perfil: 1 },
  { nome: 'Rodrigo', usuario: 'rodrigo', senha: 'rodrigo', perfil: 2 },
  { nome: 'Maria', usuario: 'maria', senha: 'maria', perfil: 2 },
];

const mesas = [
  { qtd_cadeiras: 2 },
  { qtd_cadeiras: 2 },
  { qtd_cadeiras: 3 },
  { qtd_cadeiras: 4 },
  { qtd_cadeiras: 4 },
];

const produtos = [
  {
    dsc_produto: 'Café Expresso',
    valor_unit: 5,
    imagem:
      'https://images.pexels.com/photos/19252265/pexels-photo-19252265.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Cappuccino',
    valor_unit: 8,
    imagem:
      'https://images.pexels.com/photos/6747870/pexels-photo-6747870.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Suco de Laranja',
    valor_unit: 7,
    imagem:
      'https://images.pexels.com/photos/30900665/pexels-photo-30900665.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Água Mineral',
    valor_unit: 3,
    imagem:
      'https://images.pexels.com/photos/1540235/pexels-photo-1540235.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Refrigerante',
    valor_unit: 6,
    imagem:
      'https://images.pexels.com/photos/33469209/pexels-photo-33469209.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Pão de Queijo',
    valor_unit: 4,
    imagem:
      'https://images.pexels.com/photos/33541425/pexels-photo-33541425.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Bolo de Cenoura',
    valor_unit: 6,
    imagem:
      'https://images.pexels.com/photos/5121948/pexels-photo-5121948.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Pastel de Carne',
    valor_unit: 7,
    imagem:
      'https://images.pexels.com/photos/14866635/pexels-photo-14866635.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Misto Quente',
    valor_unit: 9,
    imagem:
      'https://images.pexels.com/photos/29747752/pexels-photo-29747752.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Coxinha',
    valor_unit: 5,
    imagem:
      'https://images.pexels.com/photos/6170473/pexels-photo-6170473.jpeg?auto=compress&cs=tinysrgb&h=350',
  },
  {
    dsc_produto: 'Pão na Chapa',
    valor_unit: 4,
    imagem:
      'https://images.pexels.com/photos/3997309/pexels-photo-3997309.png?auto=compress&cs=tinysrgb&h=350',
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
  let count = existing.length;
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
    const existente = existing.find((p) => p.dsc_produto === data.dsc_produto);
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
    produtosDB.find((p) => p.dsc_produto === nome);

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
