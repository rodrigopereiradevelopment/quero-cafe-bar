import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCategoriaToProduto1782345336730 implements MigrationInterface {
    name = 'AddCategoriaToProduto1782345336730'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`produtos\` ADD \`categoria\` varchar(50) NULL`);
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP COLUMN \`senha\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD \`senha\` varchar(255) NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`usuarios\` DROP COLUMN \`senha\``);
        await queryRunner.query(`ALTER TABLE \`usuarios\` ADD \`senha\` text NOT NULL`);
        await queryRunner.query(`ALTER TABLE \`produtos\` DROP COLUMN \`categoria\``);
    }

}
