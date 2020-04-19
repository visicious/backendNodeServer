import { NextFunction, Request, Response } from 'express';
import { Sequelize, t_prospectos, test_t_prospectos, t_clientes, test_t_clientes, t_usuarios_x_prospectos, test_t_usuarios_x_prospectos } from '../config/sequelize';
import { convertirProspectoFormatoTablero } from './t_tableros';
import { calcularEstadoCliente } from './t_clientes';

let prospectosModel:any;
let clientesModel:any;
let usuarioXProspectoModel:any;
if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  prospectosModel= test_t_prospectos;
  clientesModel= test_t_clientes;
  usuarioXProspectoModel= test_t_usuarios_x_prospectos;
} else {
  prospectosModel= t_prospectos;
  clientesModel= t_clientes;
  usuarioXProspectoModel= t_usuarios_x_prospectos;
}

export const t_prospectos_controller = {
  Agregar: (req: Request, res: Response, next: NextFunction) => {
    let response:any;
    let dataProspecto: any;
    let dataCliente: any;
    if (req.body.cliente) {
      dataProspecto = req.body.prospecto;
      dataCliente = req.body.cliente;
    } else {
      dataProspecto = req.body;
      dataCliente = {};
    }

    let idUsuario = req.body.decodedJWT.id;
    // @ts-ignore
    prospectosModel.create({
      idCliente: dataProspecto.idCliente,
      porcentajeCierre: (dataProspecto.porcentajeCierre || 0) /100,
      prioridad: dataProspecto.prioridad,
      horaFechaCreacion: new Date(),
      horaFechaContacto: dataProspecto.horaFechaContacto,
      estadoFinalizacion: 'pendiente',
      comentario: dataProspecto.comentario,
      idEstadoEmbudoVenta: dataProspecto.idEstadoEmbudoVenta
    }).then((prospectoCreado: any) => {
      if (prospectoCreado) {
        usuarioXProspectoModel.create({
          idUsuario: idUsuario,
          idProspecto: prospectoCreado.id
        }).then((vinculoUsuario: any) => {
          let respuestaProspecto = {
            message: 'OK',
            content: prospectoCreado,
          };

          if (req.body.formatProspecto != null && req.body.formatProspecto.localeCompare('tablero') === 0 ) {
            if (req.body.cliente) {
              let formatedProspecto = convertirProspectoFormatoTablero(prospectoCreado, req.body.cliente,true);
              response = {
                prospecto: respuestaProspecto,
                cliente: req.body.clienteResponse,
                content: formatedProspecto
              }
              res.status(201).json(response);
              return;
            } else {
              clientesModel.findByPk(prospectoCreado.idCliente).then((cliente:any)=> {
                let formatedProspecto:any = {};
                if (cliente) {
                  formatedProspecto = convertirProspectoFormatoTablero(prospectoCreado, cliente,true);
                }

                response = {
                  prospecto: respuestaProspecto,
                  cliente: {
                    message: 'OK',
                    content: cliente,
                  },
                  content: formatedProspecto
                }
                res.status(201).json(response);
                return;
              });
            }
          } else {
            if(req.body.cliente) {
              response = {
                prospecto: respuestaProspecto,
                cliente: req.body.clienteResponse,
              }
            } else {
              response = respuestaProspecto;
            }
          }

          res.status(201).json(response);
        });
      } else {
        response = {
          message: 'ERROR',
          content: 'Error al crear el prospecto',
        };
        res.status(200).json(response)
      }
    }).catch((err:any)=> {
      response = {
        message: 'ERROR',
        content: 'Error al crear el prospecto: Datos insuficientes',
        excerpt: err.errors
      };
      res.status(400).json(response)
    });
  },
  ObtenerTodos: (req: Request, res: Response) => {
    let response
    prospectosModel.findAll().then((prospectos: any) => {
      response = {
        message: 'OK',
        content: prospectos
      }
      res.status(200).json(response)
    })
  },
  CambiarEstado: (req: Request, res: Response) => {
    let response
    let idUsuario = req.body.decodedJWT.id;

    usuarioXProspectoModel.findOne({
      attributes: ['idProspecto'],
      where: {
        idUsuario: idUsuario,
        idProspecto: req.body.id
      }
    }).then((vinculo:any) => {
      if (vinculo) {
        prospectosModel.update({
          idEstadoEmbudoVenta: req.body.idColumna
        }, {
          where: { id: req.body.id }
        }).then((prospectoUpdated: any) => {
          response = {
            message: 'OK',
            content: prospectoUpdated
          }
          res.status(200).json(response)
        })
      } else {
        response = {
          message: 'ERROR',
          content: 'Usuario no válido'
        }
        res.status(200).json(response)
      }
    });

  },
  Cerrar: (req: Request, res: Response) => {
    let response
    let idUsuario = req.body.decodedJWT.id;

    prospectosModel.hasMany(usuarioXProspectoModel, {foreignKey: 'idProspecto'})
    usuarioXProspectoModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'})
    usuarioXProspectoModel.findOne({
      attributes: ['id','idProspecto'],
      where: {
        idUsuario: idUsuario,
        idProspecto: req.body.id
      },
      include: [{
        model: prospectosModel
      }]
    }).then((vinculo:any) => {
      if (vinculo) {
        usuarioXProspectoModel.update({
          idUsuarioCierre: idUsuario
        }, {
          where: { id: vinculo.id }
        }).then((vinculoUpdated:any) => {
          prospectosModel.update({
            estadoFinalizacion: req.body.estado
          }, {
            where: { id: req.body.id }
          }).then((prospectoUpdated: any) => {
            clientesModel.update({
              estado: calcularEstadoCliente(req.body.estado) || 'nuevo'
            }, {
              where: { id: vinculo.t_prospecto.idCliente }
            }).then((clienteUpdated:any)=> {
              response = {
                message: 'OK',
                content: prospectoUpdated,
                cliente: clienteUpdated,
                vinculo: vinculoUpdated
              }
              res.status(200).json(response)
            });
          });
        });
      } else {
        response = {
          message: 'ERROR',
          content: 'Usuario no válido'
        }
        res.status(200).json(response)
      }
    })
  }
};

export const esProspecto:any = (prospecto:any) => {
  return prospecto.porcentajeCierre != null && prospecto.prioridad != null && Number.isInteger(prospecto.prioridad) && prospecto.idEstadoEmbudoVenta != null;
};

export const calcularTiempoSinContacto:any = (tiempoReferencia:any) => {
  let tiempoActual = new Date();
  let tiempoDeContacto = new Date(tiempoReferencia);

  let tiempoSinContacto:any, tiempoSinContactoNumber:any;
  // @ts-ignore
  tiempoSinContactoNumber = Math.abs(tiempoDeContacto - tiempoActual) / (1000 * 60 * 60 * 24);
  if (Math.floor(tiempoSinContactoNumber) == 0) {
    tiempoSinContactoNumber = Math.floor(tiempoSinContactoNumber*24);
    if(Math.floor(tiempoSinContactoNumber) == 1) {
      tiempoSinContacto = tiempoSinContactoNumber.toString()+' hora sin contacto';
    } else {
      tiempoSinContacto = tiempoSinContactoNumber.toString()+' horas sin contacto';
    }
  } else if (Math.floor(tiempoSinContactoNumber) == 1) {
    tiempoSinContactoNumber = Math.floor(tiempoSinContactoNumber);
    tiempoSinContacto = Math.floor(tiempoSinContactoNumber).toString() + ' día sin contacto';
  } else {
    tiempoSinContactoNumber = Math.floor(tiempoSinContactoNumber);
    tiempoSinContacto = Math.floor(tiempoSinContactoNumber).toString() + ' días sin contacto';
  }

  return [tiempoSinContacto, tiempoSinContactoNumber];
};