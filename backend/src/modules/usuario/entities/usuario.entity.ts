import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('usuarios')
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  nome: string;

  @Column()
  usuario: string;

  @Column()
  senha: string;

  @Column({ default: 0 })
  perfil: number;

  @Column({ nullable: true })
  telefone?: string;

  @Column({ nullable: true })
  endereco?: string;

  @Column({ nullable: true })
  data_nascimento?: string;

  @Column({ nullable: true })
  cpf?: string;

  @Column({ nullable: true, length: 500 })
  foto?: string;
}
