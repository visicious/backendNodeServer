import { Request, Response } from 'express';
import { t_planes, test_t_planes } from '../config/sequelize';

let planesModel:any; 
if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  planesModel= test_t_planes;
} else {
  planesModel= t_planes;
}

export const t_planes_controller = {
  Agregar: (req: Request, res: Response) => {
    let response
    let data = req.body
    planesModel.create({
      nombre: data.nombre,
      costo: data.costo,
      beneficios: data.beneficios,
    }).then((planes: any) => {
      if (planes) {
        response = {
          message: 'OK',
          content: planes
        }
        res.status(201).json(response)
      } else {
        response = {
          message: 'ERROR',
          content: 'Error al agregar planes'
        }
        res.status(200).json(response)
      }
    })
  },
  Obtener: (req: Request, res: Response) => {
    let response
    planesModel.findOne({
      where: { id: req.params.id },
    }).then((plan: any) => {
      if (plan) {
        response = {
          message: 'OK',
          content: plan
        }
        res.status(200).json(response)
      } else {
        response = {
          message: 'ERROR',
          content: 'Id Incorrecto'
        }
        res.status(200).json(response)
      }
    })
  },
  ObtenerTodos: (req: Request, res: Response) => {
    let response
    planesModel.findAll().then((planes: any) => {
      response = {
        message: 'OK',
        content: planes
      }
      res.status(200).json(response)
    })
  },
};