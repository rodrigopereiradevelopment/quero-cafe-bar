import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddMoreMesas1783500000000 implements MigrationInterface {
  name = 'AddMoreMesas1783500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 3 cadeiras de balcão (lugares individuais)
    await queryRunner.query(`
      INSERT INTO mesas (numero, qtd_cadeiras, status, localizacao, posicao_x, posicao_y)
      VALUES
        (14, 1, 1, 'bar', 120, 82),
        (15, 1, 1, 'bar', 190, 82),
        (16, 1, 1, 'bar', 260, 82)
    `);

    // 2 mesas de 4 lugares no salão
    await queryRunner.query(`
      INSERT INTO mesas (numero, qtd_cadeiras, status, localizacao, posicao_x, posicao_y)
      VALUES
        (17, 4, 1, 'salao', 100, 270),
        (18, 4, 1, 'salao', 290, 270)
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `DELETE FROM mesas WHERE numero IN (14, 15, 16, 17, 18)`,
    );
  }
}
