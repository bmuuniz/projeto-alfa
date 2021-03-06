import { getRepository } from "typeorm";
import { validate } from "isemail";
import { User, user_types } from "../entity/User";
import { Request, Response } from "express";
import { genSalt, hash } from "bcrypt";
import { validate as isValid } from "gerador-validador-cpf";
import { validateVacancyInfo,validateCompanyUser,validateProfessorUser,validateCandidateUser } from "../helpers/validations";

export const getUsers = async (request: Request, response: Response) => {
  /* Retorna todos os usuarios cadastrados */
  const users = await getRepository(User).find();
  return response.json(users);
};

export const createUser = async (request: Request, response: Response) => {
  /* 
    Faz validações de acordo com o tipo de usuário especificado pelo request,
    e se estiver tudo certo retorna as informações do usuário criado. Se alguma
    informação não for válida, retorna código 400 e uma mensagem de erro infor-
    mativa.
   */
  try {
    let { type } = request.body;
    type = Number(type);
    const {
      primary_email,
      password_unhashed,
      legal_name,
      legal_id,
      address,
      area,
      city,
      state,
      CEP,
      mobile_phone,
    } = request.body;

    const password_hash= await hash(password_unhashed, 10);
    let user: User;
    switch (type) {
      /* Trata aqui o que há de diferente para os três tipos de usuários */
      case user_types.candidate:
        const { registration_number } = request.body;
        validateCandidateUser(type, primary_email,password_hash,legal_name, registration_number,
          legal_id,
          address,
          area,
          city,
          state,
          CEP,
          mobile_phone);
        user = await getRepository(User).save({
          type,
          primary_email,
          password_hash,
          legal_name,
          registration_number,
          legal_id,
          address,
          area,
          city,
          state,
          CEP,
          mobile_phone,
          alternative_name: "",
          employee_name: "",
        });
        return response.json({ message: "user created in database", user });
        break;
      case user_types.company:
        const { alternative_name, employee_name } = request.body;
        validateCompanyUser(type,
          primary_email,
          password_unhashed,
          legal_name,
          legal_id,
          address,
          area,
          city,
          state,
          CEP,
          mobile_phone);
        user = await getRepository(User).save({
          type,
          primary_email,
          password_unhashed,
          legal_name,
          alternative_name,
          legal_id,
          address,
          area,
          city,
          state,
          CEP,
          mobile_phone,
          registration_number: "",
        });
        return response.json({ message: "user created in database", user });
        break;
      case user_types.professor:
        legal_id.valida("123.456.789-00");
        validateProfessorUser(type,
          primary_email,
          password_unhashed,
          legal_name,
          legal_id,
          address,
          area,
          city,
          state,
          CEP,
          mobile_phone);
        user = await getRepository(User).save({
          type,
          primary_email,
          password_hash,
          legal_name,
          legal_id,
          address,
          area,
          city,
          state,
          CEP,
          mobile_phone,
          registration_number: "",
          alternative_name: "",
          employee_name: "",
        });
        return response.json({ message: "user created in database", user });
        break;
      default:
        throw new Error(`Tipo de usuário inválido.`);
        break;
    }
  } catch (error) {
    response.statusCode = 400;
    return response.json({error:{"message":error.message}});
    /* 
      Foi necessário explicitamente declarar que seria retornada a propriedade 
      "message" do erro apenas, pois os erros gerados na função de validação
      não estavam se comportando corretamente.
      TODO: consertar isso para que possa retornar o objeto da exceção completo.
    */
  }
};

export const deleteUser = async (request: Request, response: Response) => {
  /* TODO: completar implementação */
  const { id } = request.params;

  const user = await getRepository(User).delete(id);

  if (!user.affected)
    throw new Error(`Ocorreu algum erro, por favor tente novamente`);
};

export const updateUser = async (request: Request, response: Response) => {
  /* TODO: completar implementação */
  let { type } = request.body;
  type = Number(type);
  const {
    id,
    primary_email,
    legal_name,
    legal_id,
    address,
    area,
    city,
    state,
    CEP,
    mobile_phone,
  } = request.body;
  
  let update: any;
  switch (type) {
    case user_types.candidate:
      const { registration_number } = request.body;
      update = await getRepository(User).update(id, {
        primary_email,
        legal_name,
        legal_id,
        address,
        area,
        city,
        state,
        CEP,
        mobile_phone,
        registration_number,
      });
      break;
    case user_types.company:
      const { alternative_name, employee_name } = request.body;
      update = await getRepository(User).update(id, {
        primary_email,
        legal_name,
        legal_id,
        address,
        area,
        city,
        state,
        CEP,
        mobile_phone,
        alternative_name,
        employee_name,
      });
      break;
    case user_types.professor:
      update = await getRepository(User).update(id, {
        primary_email,
        legal_name,
        legal_id,
        address,
        area,
        city,
        state,
        CEP,
        mobile_phone,
      });
      break;
    default:
      return response.json({ message: "erro: tipo invalido" });
  }

  const user = await getRepository(User).findOne(id);
  if (!update.affected) {
    throw new Error(`Ocorreu algum erro, favor tentar novamente`);
  }
};
