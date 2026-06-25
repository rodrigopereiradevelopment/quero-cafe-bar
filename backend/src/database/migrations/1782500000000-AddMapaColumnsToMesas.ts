import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddMapaColumnsToMesas1782500000000 implements MigrationInterface {
  name = 'AddMapaColumnsToMesas1782500000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'mesas',
      new TableColumn({
        name: 'numero',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'mesas',
      new TableColumn({
        name: 'localizacao',
        type: 'varchar',
        length: '20',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'mesas',
      new TableColumn({
        name: 'posicao_x',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'mesas',
      new TableColumn({
        name: 'posicao_y',
        type: 'int',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'mesas',
      new TableColumn({
        name: 'reservado_por',
        type: 'varchar',
        length: '100',
        isNullable: true,
      }),
    );
    await queryRunner.addColumn(
      'mesas',
      new TableColumn({
        name: 'reservado_em',
        type: 'datetime',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('mesas', 'reservado_em');
    await queryRunner.dropColumn('mesas', 'reservado_por');
    await queryRunner.dropColumn('mesas', 'posicao_y');
    await queryRunner.dropColumn('mesas', 'posicao_x');
    await queryRunner.dropColumn('mesas', 'localizacao');
    await queryRunner.dropColumn('mesas', 'numero');
  }
}
