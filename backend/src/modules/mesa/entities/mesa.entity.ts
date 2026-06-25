import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('mesas')
export class Mesa {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  qtd_cadeiras: number;

  @Column({ type: 'boolean', default: true })
  status: boolean;

  @Column({ type: 'int', nullable: true })
  numero: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  localizacao: string;

  @Column({ type: 'int', nullable: true })
  posicao_x: number;

  @Column({ type: 'int', nullable: true })
  posicao_y: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  reservado_por: string | null;

  @Column({ type: 'datetime', nullable: true })
  reservado_em: Date | null;
}
