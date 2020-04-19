import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";
import { Request, Response } from 'express';
import { Sequelize, t_interacciones, test_t_interacciones, test_t_prospectos, t_prospectos, test_t_credenciales, t_credenciales, test_t_usuarios, t_usuarios } from '../config/sequelize';
import { enviarCorreoExchange, enviarCorreoSMTP } from '../helpers/correos';
import { obtenerUrlAutenticacion, generarTokenDeCodigo, refrescarTokenAcceso } from '../helpers/exchange_auth';

const fs = require('fs');
const { Op } = require("sequelize");

let usuariosModel:any;
let prospectosModel:any;
let interaccionesModel:any;
let credencialesModel:any;
if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  usuariosModel= test_t_usuarios;
  prospectosModel= test_t_prospectos;
  credencialesModel= test_t_credenciales;
  interaccionesModel= test_t_interacciones;
} else {
  usuariosModel= t_usuarios;
  prospectosModel= t_prospectos;
  credencialesModel= t_credenciales;
  interaccionesModel= t_interacciones;
}

export const t_interacciones_controller = {
  Agregar: (req: Request, res: Response) => {
    let response;
    if (req.body.canal == null || req.body.idProspecto == null) {
      response = {
        message: 'ERROR',
        content: 'No se puede crear una interaccion sin prospecto o canal'
      };
      res.status(200).json(response);
      return;
    }

    let horaFechaInicio:any;
    if (req.body.horaFechaInicio != null) {
      horaFechaInicio = new Date(req.body.horaFechaInicio);
    } else {
      horaFechaInicio = new Date();
    }

    let horaFechaTermino:any;
    if (req.body.horaFechaTermino != null) {
      horaFechaTermino = new Date(req.body.horaFechaTermino);
    } else {
      horaFechaTermino = req.body.horaFechaTermino;
    }

    interaccionesModel.create({
      idUsuario: req.body.decodedJWT.id,
      idProspecto: req.body.idProspecto,
      canal: req.body.canal,
      horaFechaCreacion: new Date(),
      horaFechaInicio: horaFechaInicio,
      horaFechaTermino: horaFechaTermino,
      estadoInteraccion: req.body.estadoInteraccion || 0, //0 significa neutra
      comentario: req.body.comentario || '',
      eliminar: 0
    }).then((interaccion: any) => {
      if (interaccion) {
        response = {
          message: 'OK',
          content: interaccion
        }
        res.status(201).json(response)
      } else {
        response = {
          message: 'ERROR',
          content: 'Error al agregar interaccion'
        }
        res.status(200).json(response)
      }
    })
  },
  Editar: (req: Request, res: Response) => {
    let response;
    let horaFechaInicio:any;
    if (req.body.horaFechaInicio != null && req.body.horaFechaInicio != '') {
      horaFechaInicio = new Date(req.body.horaFechaInicio);
    } else {
      horaFechaInicio = req.body.horaFechaInicio;
    }

    let horaFechaTermino:any;
    if (req.body.horaFechaTermino != null && req.body.horaFechaTermino != '') {
      horaFechaTermino = new Date(req.body.horaFechaTermino);
    } else {
      horaFechaTermino = req.body.horaFechaTermino;
    }

    interaccionesModel.update({
      horaFechaInicio: horaFechaInicio,
      horaFechaTermino: horaFechaTermino,
      estadoInteraccion: req.body.estadoInteraccion,
      comentario: req.body.comentario
    },{
      where: {
        id: req.body.id
      }
    }).then((interaccionUpdated: any) => {
      response = {
        message: 'OK',
        content: interaccionUpdated
      }
      res.status(200).json(response)
    })
  },
  Eliminar: (req: Request, res: Response) => {
    let response;

    interaccionesModel.update({
      eliminar: 1,
    },{
      where: {
        id: req.body.id
      }
    }).then((interaccionUpdated: any) => {
      response = {
        message: 'OK',
        content: interaccionUpdated
      }
      res.status(200).json(response)
    }).catch((err:any)=> {
      response = {
        message: 'ERROR',
        content: 'Es necesario enviar una interaccion a modificar'
      }
      res.status(200).json(response)
    });
  },
  ColocarFechaTermino: (req: Request, res: Response) => {
    let response;
    let horaFechaTermino:any;
    if (req.body.horaFechaTermino != null && req.body.horaFechaTermino != '') {
      horaFechaTermino = new Date(req.body.horaFechaTermino);
    } else {
      horaFechaTermino = req.body.horaFechaTermino;
    }

    interaccionesModel.update({
      horaFechaTermino: horaFechaTermino,
    },{
      where: {
        id: req.body.id
      }
    }).then((interaccionUpdated: any) => {
      response = {
        message: 'OK',
        content: interaccionUpdated
      }
      res.status(200).json(response)
    }).catch((err:any)=> {
      response = {
        message: 'ERROR',
        content: 'Es necesario enviar una interaccion a modificar'
      }
      res.status(200).json(response)
    });
  },
  ObtenerTodosPorCanal: (req: Request, res: Response) => {
    let response
    if (req.body.canal == null || req.body.idCliente == null) {
      response = {
        message: 'ERROR',
        content: 'Se necesita canal y cliente para buscar las interacciones'
      };
      res.status(200).json(response);
      return;
    }

    prospectosModel.hasMany(interaccionesModel, {foreignKey: 'idProspecto'})
    interaccionesModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'})
    interaccionesModel.findAll({
      order: [
        ['horaFechaInicio','ASC']
      ],
      where: {
        idUsuario: req.body.decodedJWT.id,
        canal: req.body.canal,
        eliminar: 0
      },
      include: [{
        model: prospectosModel,
        where: { idCliente: req.body.idCliente }
      }],
    }).then((interacciones: any) => {
      response = {
        message: 'OK',
        content: interacciones
      }
      res.status(200).json(response)
    })
  },
  GenerarInteraccionCorreo: (req: Request, res: Response) => {
    let response:any;
    
    if (req.body.to == null || req.body.subject == null) {
      response = {
        message: 'ERROR',
        content: 'Se necesita email y asunto para enviar los datos'
      };
      res.status(200).json(response);
      return;
    }
    console.log(req.body);

    //TODO : Only working with Microsoft and STMP accounts by now. Pending Google
    usuariosModel.hasOne(credencialesModel, {foreignKey: 'idUsuario'});
    credencialesModel.belongsTo(usuariosModel, {foreignKey: 'idUsuario'});
    usuariosModel.findOne({
      where: { id: req.body.decodedJWT.id },
      include: [{
        model: credencialesModel
      }]
    }).then((usuario:any) => {
      let credencial = usuario.t_credenciale;
      if (credencial) {
        let funcionEnvioCorreo:any;
        switch(tipoCredencialCorreo(credencial)) {
          case 'exchange':
            funcionEnvioCorreo = enviarCorreoExchange;
            break;
          case 'stmp':
            usuario.t_credenciale["AESSalt"] = usuario.usuarioSalt;
            funcionEnvioCorreo = enviarCorreoSMTP;
            break;
          case 'vacio':
            response = {
              message: 'ERROR',
              content: 'Sus credenciales estan vacías. Registre su correo por SMTP, Exchange o Gmail para poder enviar sus correos'
            };
            res.status(200).json(response);
            return;
            break;
        }

        funcionEnvioCorreo(req, credencial).then((correoEnviado:any) => {
          if (correoEnviado[1].message == 'OK') {
            interaccionesModel.create({
              idUsuario: req.body.decodedJWT.id,
              idProspecto: req.body.idProspecto,
              canal: 'correo',
              horaFechaCreacion: new Date(),
              horaFechaInicio: new Date(),
              estadoInteraccion: 0,
              comentario: 'Con el asunto: '+req.body.subject+' ,se envío el siguiente correo: '+ req.body.body,
              eliminar: 0
            }).then((interaccionCreada:any) => {
              response = {
                message: 'OK',
                content: 'Mensaje correctamente enviado a 1 usuarios'
              };
              res.status(200).json(response);
            });
          } else {
            response = correoEnviado[1];
            res.status(200).json(response);
          }
        }).catch((error:any) => {
          response = {
            message: 'ERROR',
            content: 'No se pudo enviar correctamente el correo. Intentelo nuevamente o pongase en contacto con soporte'
          };
          res.status(200).json(response);
        });
      } else {
        let urlIngresar = obtenerUrlAutenticacion();
        res.redirect(urlIngresar);
      }
    });
  },
  GenerarInteraccionCorreoGlobal: (req: Request, res: Response) => {
    let response:any;

    if (req.body.to == null || req.body.subject == null || req.body.idClientes == null) {
      response = {
        message: 'ERROR',
        content: 'Se necesita email y asunto para enviar los datos'
      };
      res.status(200).json(response);
      return;
    }
    console.log(req.body);

    let idClientes:any = [];
    if (typeof req.body.idClientes == 'number' || typeof req.body.idClientes == 'string') {
      idClientes.push(req.body.idClientes);
    } else {
      idClientes = req.body.idClientes;
    }

    //TODO : Only working with Microsoft and STMP accounts by now. Pending Google
    usuariosModel.hasOne(credencialesModel, {foreignKey: 'idUsuario'});
    credencialesModel.belongsTo(usuariosModel, {foreignKey: 'idUsuario'});
    usuariosModel.findOne({
      where: { id: req.body.decodedJWT.id },
      include: [{
        model: credencialesModel
      }]
    }).then((usuario:any) => {
      let credencial = usuario.t_credenciale;
      if (credencial) {
        prospectosModel.findAll({
          attributes:["idCliente", "id"],
          order: [['horaFechaCreacion','ASC']],
          where: { 
            idCliente: {
              [Op.in]: idClientes
            }
          }
        }).then((prospectos:any) => {
          if (prospectos.length > 0) {
            let funcionEnvioCorreo:any;
            let prospectosLimpios:any = [];

            for( let j = 0; j < prospectos.length; j++) {
              prospectosLimpios[prospectos[j].idCliente] = prospectos[j];
            }
            prospectosLimpios = prospectosLimpios.filter((prospecto:any) => {
              return prospecto != null;
            });

            switch(tipoCredencialCorreo(credencial)) {
              case 'exchange':
                funcionEnvioCorreo = enviarCorreoExchange;
                break;
              case 'stmp':
                usuario.t_credenciale["AESSalt"] = usuario.usuarioSalt;
                funcionEnvioCorreo = enviarCorreoSMTP;
                break;
              case 'vacio':
                response = {
                  message: 'ERROR',
                  content: 'Sus credenciales estan vacías. Registre su correo por SMTP, Exchange o Gmail para poder enviar sus correos'
                };
                res.status(200).json(response);
                return;
                break;
            }

            funcionEnvioCorreo(req, credencial).then(async(correoEnviado:any) => {
              if (correoEnviado[1].message == 'OK') {
                let interaccionesCreadasCount = 0;
                for( let i = 0; i < prospectosLimpios.length; i++) {
                  let interaccionCreada = await interaccionesModel.create({
                    idUsuario: req.body.decodedJWT.id,
                    idProspecto: prospectosLimpios[i].id,
                    canal: 'correo',
                    horaFechaCreacion: new Date(),
                    horaFechaInicio: new Date(),
                    estadoInteraccion: 0,
                    comentario: 'Con el asunto: '+req.body.subject+' ,se envío el siguiente correo: '+ req.body.body,
                    eliminar: 0
                  });

                  if (interaccionCreada) {
                    interaccionesCreadasCount++;
                  }
                }

                response = {
                  message: 'OK',
                  content: 'Mensaje correctamente enviado a '+interaccionesCreadasCount+' usuarios'
                };
                res.status(200).json(response);
              } else {
                response = correoEnviado[1];
                res.status(200).json(response);
              }
            }).catch((error:any) => {
              response = {
                message: 'ERROR',
                content: 'No se pudo enviar correctamente el correo. Intentelo nuevamente o pongase en contacto con soporte'
              };
              res.status(200).json(response);
            });
          } else {
            response = {
              message: 'OK',
              content: 'Mensaje correctamente enviado a '+prospectos.length+' usuarios'
            };
            res.status(200).json(response);
          }
        });
      } else {
        let urlIngresar = obtenerUrlAutenticacion();
        res.redirect(urlIngresar);
      }
    });
  },
  GenerarInteraccionWhatsapp: (req: Request, res: Response) => {
    let response:any;
    
    if (req.body.to == null || req.body.to.length == 0 || req.body.body == null) {
      response = {
        message: 'ERROR',
        content: 'Se necesita telefono y mensaje para enviar un whatsapp'
      };
      res.status(200).json(response);
      return;
    }
    console.log(req.body);

    let adjuntos:any = [];
    let adjunto:any;
    let contentBytes:any;
    //Temporal hasta que se pueda enviar a varios numeros usando twillio
    if (typeof req.body.to != 'string' && typeof req.body.to != 'number') {
      req.body.to = req.body.to[0];
    }

    interaccionesModel.create({
      idUsuario: req.body.decodedJWT.id,
      idProspecto: req.body.idProspecto,
      canal: 'whatsapp',
      horaFechaCreacion: new Date(),
      horaFechaInicio: new Date(),
      estadoInteraccion: 0,
      comentario: 'Se envío el siguiente whatsapp: '+ req.body.body,
      eliminar: 0
    }).then((interaccionCreada:any) => {
      response = {
        message: 'OK',
        content: 'Mensaje correctamente enviado',
        link: 'https://api.whatsapp.com/send?phone=+51'+req.body.to+'&text='+req.body.body,
      };
      res.status(200).json(response);
    });
  },
};

export const contarInteraccionesPorCanal:any = async (filtros:any, idCliente?:any) => {
  let restriccionesConsulta:any = {};
  if (idCliente != null) {
    restriccionesConsulta = { idCliente: idCliente }
  }

  prospectosModel.hasMany(interaccionesModel, {foreignKey: 'idProspecto'})
  interaccionesModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'})
  let totalInteracciones = await interaccionesModel.count({
    attributes: ['id'],
    where: filtros,
    include: [{
      attributes: ['idCliente'],
      model: prospectosModel,
      where: restriccionesConsulta
    }],
  })

  return totalInteracciones || 0;
};

export const contarInteracciones:any = async (idUsuario:any, idCliente?:any, idProspecto?:any) => {
  let restriccionesConsulta:any = {};
  if (idCliente != null) {
    restriccionesConsulta['idCliente'] = idCliente;
  }
  if (idProspecto != null) {
    restriccionesConsulta['id'] = idProspecto;
  }

  prospectosModel.hasMany(interaccionesModel, {foreignKey: 'idProspecto'})
  interaccionesModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'})
  let totalInteracciones = await interaccionesModel.findAll({
    attributes: {
      include: [
        [Sequelize.literal('COUNT(CASE WHEN canal = "whatsapp" THEN 1 ELSE NULL END)'), 'whatsappTotales'],
        [Sequelize.literal('COUNT(CASE WHEN canal = "correo" THEN 1 ELSE NULL END)'), 'correoTotales'],
        [Sequelize.literal('COUNT(CASE WHEN canal = "telefono" THEN 1 ELSE NULL END)'), 'telefonoTotales']
      ]
    },
    where: {
      idUsuario: idUsuario
    },
    include: [{
      model: prospectosModel,
      where: restriccionesConsulta
    }],
  })

  return {
    whatsapp: totalInteracciones.whatsappTotales,
    correo: totalInteracciones.correoTotales,
    telefono: totalInteracciones.telefonoTotales
  };
};

export const tipoCredencialCorreo:any = (credencial:any) => {
  if (credencial.exchangeToken != null && credencial.exchangeRefreshToken != null && credencial.exchangeExpireTimestamp != null) {
    return 'exchange';
  } else if (credencial.AESClave != null && credencial.SMTPPuerto != null && credencial.SMTPHost != null && credencial.SMTPUsuario != null && credencial.SMTPPassword != null) {
    return 'stmp';
  } else {
    return 'vacio';
  }
};