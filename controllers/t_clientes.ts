import { NextFunction, Request, Response } from 'express';
import { Sequelize, test_t_clientes, t_clientes, test_t_prospectos, t_prospectos, test_t_usuarios_x_prospectos, t_usuarios_x_prospectos,test_t_usuarios_x_clientes, t_usuarios_x_clientes } from '../config/sequelize';
import { esProspecto } from './t_prospectos';

const { Op } = require("sequelize");
const jwt = require('jsonwebtoken');
let clientesModel:any;
let prospectosModel:any;
let usuariosXProspectosModel:any;
let usuariosXClientesModel:any;
if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  clientesModel= test_t_clientes;
  prospectosModel= test_t_prospectos;
  usuariosXClientesModel = test_t_usuarios_x_clientes;
  usuariosXProspectosModel = test_t_usuarios_x_prospectos;
} else {
  clientesModel= t_clientes;
  prospectosModel= t_prospectos;
  usuariosXClientesModel = t_usuarios_x_clientes;
  usuariosXProspectosModel= t_usuarios_x_prospectos;
}

export const t_clientes_controller = {
  Agregar: (req: Request, res: Response, next:NextFunction) => {
    let response
    let dataProspecto: any;
    let dataCliente: any;
    if (req.body.prospecto != null) {
      dataCliente = req.body.cliente;
      dataProspecto = req.body.prospecto;
    } else if(esCliente(req.body)) {
      dataCliente = req.body;
      dataProspecto = {};
    } else if(esProspecto(req.body)){
      next();
      return;
    } else {
      response = {
        message: 'ERROR',
        content: 'Datos incorrectos',
      };
      res.status(200).json(response)
      return;
    }

    let cliente:any = {
      intencionCompra: 0,
      estado: 'prospecto',
      observacion: dataCliente.comentario || '',
      horaFechaCreacion: new Date(),
      correoPrimario: dataCliente.correo || null,
      telefonoPrimario: dataCliente.telefono || null,
      direccion: dataCliente.direccion,
      web: dataCliente.web,
    }
    if (dataCliente.nombres && dataCliente.apellidos && dataCliente.genero) {
      cliente["nombres"] = dataCliente.nombres;
      cliente["apellidos"] = dataCliente.apellidos;
      cliente["genero"] = dataCliente.genero;
      cliente["empresa"] = '';
    } else if (dataCliente.empresa) {
      cliente["nombres"] = '';
      cliente["apellidos"] = '';
      cliente["genero"] = '';
      cliente["empresa"] = dataCliente.empresa;
      cliente["ruc"] = dataCliente.ruc;
    } else {
      response = {
        message: 'ERROR',
        content: 'Datos de tipo de cliente insuficientes',
      };
      res.status(200).json(response)
      return;   
    }

    let horaFechaContacto:any;
    if (req.body.horaFechaContacto != null && req.body.horaFechaContacto != '') {
      cliente['horaFechaContacto'] = new Date(req.body.horaFechaContacto);
    } else {
      cliente['horaFechaContacto'] = null;
    }
    
    clientesModel.create(cliente).then((clienteCreado: any) => {
      if (clienteCreado) {
        usuariosXClientesModel.create({
          idUsuario: req.body.decodedJWT.id,
          idCliente: clienteCreado.id
        }).then((vinculoUsuario:any)=> {
          response = {
            message: 'OK',
            content: clienteCreado,
          };

          if(req.body.prospecto) {
            req.body.prospecto.idCliente = clienteCreado.id;
            req.body.clienteResponse = response;
            next();
          } else {
            res.status(201).json(response);
          }
        });
      } else {
        response = {
          message: 'ERROR',
          content: `Cliente no pudo ser guardado. Intente nuevamente`
        };
        res.status(200).json(response)
      }
    });
  },
  ObtenerCorreosTodos: (req: Request, res: Response) => {
    let response
    let usuarioId = req.body.decodedJWT.id;
    clientesModel.hasMany(usuariosXClientesModel, {foreignKey: 'idCliente'})
    usuariosXClientesModel.belongsTo(clientesModel, {foreignKey: 'idCliente'})
    clientesModel.findAll({
      attributes: [ 'id','genero', 'nombres', 'apellidos', 'correoPrimario', 'correoSecundario', 'empresa' ],
      order: [
        ['nombres', 'ASC']
      ],
      where: {
        [Op.or]: [
          {
            correoPrimario: {
              [Op.ne]: null
            }
          },
          {
            correoSecundario: {
              [Op.ne]: null
            }
          }
        ]
      },
      include: [{
        model: usuariosXClientesModel,
        where: { idUsuario: usuarioId }
      }]
    }).then((clientes: any) => {
      let clientesFormatted = clientes.map((cliente:any) => {
        if (cliente.genero != null && cliente.nombres != null && cliente.apellidos != null) {
          return {
            id: cliente.id,
            titulo: cliente.nombres+' '+cliente.apellidos,
            correo: cliente.correoPrimario || cliente.correoSecundario
          };
        } else {
          return {
            id: cliente.id,
            titulo: cliente.empresa,
            correo: cliente.correoPrimario || cliente.correoSecundario
          };
        }
      });

      response = {
        message: 'OK',
        content: clientesFormatted
      }
      res.status(200).json(response)
    })
  },
  ObtenerTelefonosTodos: (req: Request, res: Response) => {
    let response
    let usuarioId = req.body.decodedJWT.id;
    clientesModel.hasMany(usuariosXClientesModel, {foreignKey: 'idCliente'})
    usuariosXClientesModel.belongsTo(clientesModel, {foreignKey: 'idCliente'})
    clientesModel.findAll({
      attributes: [ 'id','genero', 'nombres', 'apellidos', 'telefonoPrimario', 'telefonoSecundario', 'empresa' ],
      order: [
        ['nombres', 'ASC']
      ],
      where: {
        [Op.or]: [
          {
            telefonoPrimario: {
              [Op.ne]: null
            }
          },
          {
            telefonoSecundario: {
              [Op.ne]: null
            }
          }
        ]
      },
      include: [{
        model: usuariosXClientesModel,
        where: { idUsuario: usuarioId }
      }]
    }).then((clientes: any) => {
      let clientesFormatted = clientes.map((cliente:any) => {
        if (cliente.genero != null && cliente.nombres != null && cliente.apellidos != null) {
          return {
            id: cliente.id,
            titulo: cliente.nombres+' '+cliente.apellidos,
            telefono: cliente.telefonoPrimario || cliente.telefonoSecundario
          };
        } else {
          return {
            id: cliente.id,
            titulo: cliente.empresa,
            telefono: cliente.telefonoPrimario || cliente.telefonoSecundario
          };
        }
      });

      response = {
        message: 'OK',
        content: clientesFormatted
      }
      res.status(200).json(response)
    })
  },
  //TODO: Clean this mess. ObtenerTodos should not be working as t_vista_clientes ObtenerTodos
  ObtenerTodos: (req: Request, res: Response) => {
    let response
    let usuarioId = req.params.id;
    clientesModel.hasMany(prospectosModel, {foreignKey: 'idCliente'})
    prospectosModel.belongsTo(clientesModel, {foreignKey: 'idCliente'})
    prospectosModel.hasMany(usuariosXProspectosModel, {foreignKey: 'idProspecto'})
    usuariosXProspectosModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'})
    prospectosModel.findAll({
      order: [
        ['horaFechaCreacion', 'ASC']
      ],
      include: [{
        model: clientesModel,
      },
      {
        model: usuariosXProspectosModel,
        where: { idUsuario: usuarioId }
      }]
    }).then((prospectos: any) => {
      let clientesFormatted:any = {};
      let cantidadCierresTotal:any = {};
      for(let i = 0; i < prospectos.length; i++) {
        if (prospectos[i].estadoFinalizacion == 'ganado') {
          if (prospectos[i].id.toString() in cantidadCierresTotal) {
            cantidadCierresTotal[prospectos[i].id] += 1;
          } else {
            cantidadCierresTotal[prospectos[i].id] = 1;
          }
        }

        let clienteFormatted:any = {
          id: prospectos[i].t_cliente.id,
          tipo: esClientePersona(prospectos[i].t_cliente)?'persona':'empresa',
          nombres: prospectos[i].t_cliente.nombres,
          apellidos: prospectos[i].t_cliente.apellidos,
          genero: prospectos[i].t_cliente.genero,
          empresa: prospectos[i].t_cliente.empresa,
          ruc: prospectos[i].t_cliente.ruc,
          correo: prospectos[i].t_cliente.correoPrimario,
          telefono: prospectos[i].t_cliente.telefonoPrimario,
          estadoCliente: prospectos[i].t_cliente.estado,
          intencionCompra: prospectos[i].t_cliente.intencionCompra,
          numeroInteracciones: 5, //TODO: interacciones
          cantidadCierres: cantidadCierresTotal[prospectos[i].id] || 0,
          observacion: prospectos[i].t_cliente.observacion,
          direccion: prospectos[i].t_cliente.direccion,
          web: prospectos[i].t_cliente.web,
          interacciones: {
            telefono: 2,
            whatsapp: 3,
            correo: 0,
          },
          ultimoProspecto: {
            id: prospectos[i].id,
            idCliente: prospectos[i].idCliente,
            porcentajeCierre: prospectos[i].porcentajeCierre*100,
            prioridad: prospectos[i].prioridad,
            horaFechaCreacion: prospectos[i].horaFechaCreacion,
            horaFechaContacto: prospectos[i].horaFechaContacto,
            estadoFinalizacion: prospectos[i].estadoFinalizacion,
            comentario: prospectos[i].comentario,
            idEstadoEmbudoVenta: prospectos[i].idEstadoEmbudoVenta
          }
        };

        clientesFormatted[prospectos[i].idCliente] = clienteFormatted;
      }

      response = {
        message: 'OK',
        content: Object.values(clientesFormatted)
      }
      res.status(200).json(response)
    })
  },
};

export const esCliente:any = (cliente:any) => {
  return (cliente.nombres != null && cliente.apellidos != null && cliente.genero != null) || cliente.empresa != null
};

export const esClientePersona:any = (cliente:any) => {
  return (cliente.nombres != null && cliente.apellidos != null && cliente.genero != null && cliente.nombres != '' && cliente.apellidos != '' && cliente.genero != '')
};

export const calcularEstadoCliente:any = (estadoProspecto:any) => {
  switch (estadoProspecto) {
    case "ganado":
      return 'cliente';
      break;
    case "perdido":
      return 'perdido';
      break;
    case "pendiente":
      return 'prospecto';
      break;
    default:
      return null;
      break;
  }
};