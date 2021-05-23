// crie aqui a tabela user no mesmo estilo da tabela tasks
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  Timestamp,
} from "typeorm";

export enum user_types {
  candidate,
  company,
  professor,
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  type: user_types;

  @Column({ unique: true })
  primary_email: string; // email ufba (professor ou aluno) ou email normal (empresa)

  @Column({ type: "varchar", nullable: false })
  password: string;

  @Column()
  legal_name: string; // nome completo ou razao social

  @Column()
  alternative_name: string;

  @Column()
  employee_name: string;

  @Column({ unique: true })
  registration_number: string; // apenas para user

  @Column({ unique: true })
  legal_id: string; // cpf ou cnpj

  @Column()
  address: string; // primeira linha do endereço (ex: rua + numero + complemento)

  @Column()
  area: string; // area

  @Column()
  city: string; //

  @Column()
  state: string; // usar um object com todas as siglas e nomes extensos para validar, tipo {"BA":"Bahia"}

  @Column()
  CEP: string;

  @Column()
  mobile_phone: string;

  @CreateDateColumn()
  created_at: Timestamp;

  @UpdateDateColumn()
  updated_at: Timestamp;
}
