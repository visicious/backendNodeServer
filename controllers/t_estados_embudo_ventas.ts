import { Request, Response } from 'express';
import { Sequelize, test_t_estados_embudo_ventas, t_estados_embudo_ventas } from '../config/sequelize';
import { existeUsuario } from './t_usuarios';

const jwt = require('jsonwebtoken');
let estadosEmbudoVentasModel:any; 
if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  estadosEmbudoVentasModel= test_t_estados_embudo_ventas;
} else {
  estadosEmbudoVentasModel= t_estados_embudo_ventas;
}

export const t_estados_embudo_ventas_controller = {
  Agregar: (req: Request, res: Response) => {
    let response;
    let usuarioId = req.body.decodedJWT.id;
    existeUsuario(usuarioId).then((existe:boolean)=> {
      // @ts-ignore
      if(existe) {
        estadosEmbudoVentasModel.findAll({
          where: { idUsuario: usuarioId }
        }).then((estados: any) => {
          let orden = 0;
          if (estados.length && estados.length > 0) {
            //Obtiene el orden del último elemento y se coloca inmediatamente después
            orden = estados[estados.length - 1].orden + 1;
          }
          estadosEmbudoVentasModel.create({
            idUsuario: usuarioId,
            nombre: req.body.nombre,
            orden: orden,
            horaFechaCreacion: new Date(),
            horaFechaModificacion: new Date()
          }).then((estadoCreado: any) => {
            if (estadoCreado) {
              response = {
                message: 'OK',
                content: estadoCreado,
              };
              res.status(201).json(response);
            } else {
              response = {
                message: 'ERROR',
                content: `Estado no pudo ser guardado. Intente nuevamente`
              };
              res.status(200).json(response)
            }
          });
        });
      }
    })
  },
  ObtenerTodos: (req: Request, res: Response) => {
    let response
    estadosEmbudoVentasModel.findAll().then((estados: any) => {
      response = {
        message: 'OK',
        content: estados
      }
      res.status(200).json(response)
    })
  },
};