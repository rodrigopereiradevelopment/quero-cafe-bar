import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImagemProduto1781742750318 implements MigrationInterface {
  name = 'AddImagemProduto1781742750318';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`produtos\` ADD \`imagem\` varchar(500) NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`imagem\``);
  }
}
