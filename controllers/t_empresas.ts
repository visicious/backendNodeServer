import { NextFunction, Request, Response } from 'express';
import { Sequelize, t_empresas, test_t_empresas } from '../config/sequelize';

const { Op } = require("sequelize");
let empresasModel:any; 
if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  empresasModel= test_t_empresas;
} else {
  empresasModel= t_empresas;
}

export const t_empresas_controller = {
  Agregar: (req: Request, res: Response, next: NextFunction) => {
    let response
    let dataUsuarios: Object;
    let dataEmpresas: Object;
    if (req.body.usuario) {
      dataEmpresas = req.body.empresa;
      dataUsuarios = req.body.usuario;
    } else {
      dataEmpresas = req.body;
      dataUsuarios = {};
    }
    // @ts-ignore
    const nombre = dataEmpresas.nombre;
    // @ts-ignore
    empresasModel.findAll({
      where: Sequelize.where(
        Sequelize.fn('lower', Sequelize.col('nombre')),
        {
          [Op.like]: nombre
        }
      )
    }).then((empresas: any) => {
      if (empresas.length === 0) {
        let empresa = empresasModel.build(dataEmpresas);
        empresa.horaFechaCreacion = new Date();
        empresa.save().then((empresaCreada: any) => {
          if (empresaCreada) {
            response = {
              message: 'OK',
              content: empresaCreada,
            };
            if(req.body.usuario) {
              req.body.usuario.idEmpresa = empresaCreada.id;
              req.body.empresaResponse = response;
              next();
            } else {
              res.status(201).json(response);   
            }
          } else {
            response = {
              message: 'ERROR',
              content: 'Error al crear el empresa',
            };
            res.status(200).json(response)
          }
        });
      } else {
        response = {
          message: 'ERROR',
          // @ts-ignore
          content: `Una empresa con el nombre ${dataEmpresas.nombre} ya existe. Pruebe agregandole un diferencial`
        };
        res.status(200).json(response)
      }
    });
  },
};