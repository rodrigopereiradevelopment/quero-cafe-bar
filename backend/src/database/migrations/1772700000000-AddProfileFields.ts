import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddProfileFields1772700000000 implements MigrationInterface {
  name = 'AddProfileFields1772700000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE usuarios ADD COLUMN endereco VARCHAR(255)`,
    );
    await queryRunner.query(
      `ALTER TABLE usuarios ADD COLUMN data_nascimento VARCHAR(255)`,
    );
    await queryRunner.query(`ALTER TABLE usuarios ADD COLUMN cpf VARCHAR(255)`);
    await queryRunner.query(
      `ALTER TABLE usuarios ADD COLUMN foto VARCHAR(500)`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE usuarios DROP COLUMN telefone`);
    await queryRunner.query(`ALTER TABLE usuarios DROP COLUMN endereco`);
    await queryRunner.query(`ALTER TABLE usuarios DROP COLUMN data_nascimento`);
    await queryRunner.query(`ALTER TABLE usuarios DROP COLUMN cpf`);
    await queryRunner.query(`ALTER TABLE usuarios DROP COLUMN foto`);
  }
}
