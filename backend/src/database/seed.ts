import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UsuarioService } from '../modules/usuario/usuario.service';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const usuarioService = app.get(UsuarioService);

  try {
    await usuarioService.findByUsuario('admin');
    console.log('Usuário admin já existe. Pulando seed.');
  } catch {
    await usuarioService.create({
      nome: 'Administrador',
      usuario: 'admin',
      senha: 'admin',
      perfil: 0,
    });
    console.log('Usuário admin criado com sucesso!');
  }

  try {
    await usuarioService.findByUsuario('garcom');
  } catch {
    await usuarioService.create({
      nome: 'Garçom',
      usuario: 'garcom',
      senha: 'garcom',
      perfil: 1,
    });
    console.log('Usuário garcom criado com sucesso!');
  }

  await app.close();
  console.log('Seed concluído.');
}

seed().catch((err) => {
  console.error('Erro no seed:', err);
  process.exit(1);
});
