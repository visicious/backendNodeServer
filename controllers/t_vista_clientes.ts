import { NextFunction, Request, Response } from 'express';
import { Sequelize, test_t_clientes, t_clientes, test_t_interacciones, t_interacciones, test_t_prospectos, t_prospectos, test_t_usuarios_x_prospectos, t_usuarios_x_prospectos , test_t_usuarios_x_clientes, t_usuarios_x_clientes } from '../config/sequelize';
import { esProspecto } from './t_prospectos';
import { esClientePersona } from './t_clientes';
import { contarInteraccionesPorCanal, contarInteracciones } from './t_interacciones';

const jwt = require('jsonwebtoken');
const { Op } = require("sequelize");
let clientesModel:any;
let prospectosModel:any;
let usuariosXProspectosModel:any;
let usuariosXClientesModel:any;
let interaccionesModel:any;
if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  clientesModel= test_t_clientes;
  prospectosModel= test_t_prospectos;
  interaccionesModel = test_t_interacciones;
  usuariosXClientesModel = test_t_usuarios_x_clientes;
  usuariosXProspectosModel = test_t_usuarios_x_prospectos;
} else {
  clientesModel= t_clientes;
  prospectosModel= t_prospectos;
  interaccionesModel= t_interacciones;
  usuariosXClientesModel= t_usuarios_x_clientes;
  usuariosXProspectosModel= t_usuarios_x_prospectos;
}

export const t_vista_clientes_controller = {
  ObtenerTodos: (req: Request, res: Response) => {
    let response
    let usuarioId = req.body.decodedJWT.id;

    let consulta = req.body.query || null;
    let consultaOffset = (consulta.page * consulta.pageSize) || 0;
    let consultaLimit = (consulta.page * consulta.pageSize) + consulta.pageSize;
    let filtroOrden:any = [[prospectosModel,'horaFechaCreacion', 'DESC']];
    let direccionOrden:any = 'DESC';
    let filtroInterno:any = null;
    let busquedaTextual:any = {};
    let busquedaNumerica:any = false;
    let totalClientes:any;

    if (consulta != null && consulta.orderBy != null) {
      direccionOrden = consulta.orderDirection;
      switch (consulta.orderBy.field) {
        case "prioridad":
          filtroOrden = [[prospectosModel,consulta.orderBy.field, direccionOrden]];
          break;
        case "estadoCliente":
          filtroOrden = [['estado', direccionOrden]];
          break;
        case "intencionCompra":
          filtroOrden = [['intencionCompra', direccionOrden]];
          break;
        case "cantidadCierres":
          filtroInterno = 'cantidadCierres';
          break;
        case "numeroInteracciones":
          filtroInterno = 'numeroInteracciones';
          break;
        default:
          filtroOrden = [[prospectosModel,'horaFechaCreacion', direccionOrden]];
          break;
      }
    } else if (consulta != null && consulta.orderCanal != null) {
      direccionOrden = consulta.orderCanal.orderDirection;
      filtroInterno = "interaccionCanales";
    }

    if (consulta != null && consulta.search != null && consulta.search != '') {
      if (!Number.isInteger(parseInt(consulta.search))) {
        busquedaTextual = {
          [Op.and]: [
            Sequelize.literal('LOWER(t_clientes.nombres) LIKE "%'+consulta.search+'%" or LOWER(t_clientes.apellidos) LIKE "%'+consulta.search+'%" or LOWER(t_clientes.correoPrimario) LIKE "%'+consulta.search+'%" or LOWER(t_clientes.telefonoPrimario) LIKE "%'+consulta.search+'%" or LOWER(t_clientes.estado) LIKE "%'+consulta.search+'%" or LOWER(t_clientes.empresa) LIKE "%'+consulta.search+'%"')
          ]
        }
      }
      else {
        busquedaNumerica = true;
      }
    }

    clientesModel.hasMany(prospectosModel, {foreignKey: 'idCliente'})
    prospectosModel.belongsTo(clientesModel, {foreignKey: 'idCliente'})
    prospectosModel.hasMany(interaccionesModel, {foreignKey: 'idProspecto'})
    interaccionesModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'})
    prospectosModel.hasMany(usuariosXProspectosModel, {foreignKey: 'idProspecto'})
    usuariosXProspectosModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'})
    clientesModel.hasMany(usuariosXClientesModel, {foreignKey: 'idCliente'})
    usuariosXClientesModel.belongsTo(clientesModel, {foreignKey: 'idCliente'})
    clientesModel.findAll({
      where: busquedaTextual,
      order: filtroOrden,
      include: [{
        attributes: ['id','idCliente','prioridad','horaFechaCreacion','estadoFinalizacion','idEstadoEmbudoVenta'],
        model: prospectosModel,
        include: [{
          model: interaccionesModel,
        },{
          attributes: ['idUsuario'],
          model: usuariosXProspectosModel,
          where: { idUsuario: usuarioId }
        }],
      },
      {
        attributes: ['idUsuario'],
        model: usuariosXClientesModel,
        where: { idUsuario: usuarioId }
      }],
    }).then((clientes: any) => {
      let clientesFormatted:any = [];
      for(let i = 0; i < clientes.length; i++) {
        let cantidadCierresTotal:any = 0;
        let cantidadInteraccionesTotal:any = 0;
        let contadorInteracciones = {
          telefono: 0,
          whatsapp: 0,
          correo: 0,
        }
        let ultimoProspecto = clientes[i].t_prospectos[clientes[i].t_prospectos.length - 1] || {};
        for(let j = 0; j < clientes[i].t_prospectos.length; j++) {
          if (ultimoProspecto.horaFechaCreacion < clientes[i].t_prospectos[j].horaFechaCreacion) {
            ultimoProspecto = clientes[i].t_prospectos[j];
          }
          if (clientes[i].t_prospectos[j].estadoFinalizacion == 'ganado') {
            cantidadCierresTotal += 1;
          }
          cantidadInteraccionesTotal = clientes[i].t_prospectos[j].t_interacciones.filter((interaccion:any)=>{
            return interaccion.eliminar == 0 && interaccion.idUsuario == usuarioId;
          }).length;
        }

        if (ultimoProspecto.t_interacciones != null) {
          contadorInteracciones.telefono = ultimoProspecto.t_interacciones.filter((interaccion:any)=>{
            return interaccion.canal == 'telefono' && interaccion.eliminar == 0 && interaccion.idUsuario == usuarioId;
          }).length;
          contadorInteracciones.whatsapp = ultimoProspecto.t_interacciones.filter((interaccion:any)=>{
            return interaccion.canal == 'whatsapp' && interaccion.eliminar == 0 && interaccion.idUsuario == usuarioId;
          }).length;
          contadorInteracciones.correo = ultimoProspecto.t_interacciones.filter((interaccion:any)=>{
            return interaccion.canal == 'correo' && interaccion.eliminar == 0 && interaccion.idUsuario == usuarioId;
          }).length;
        }

        let correos:any = [];
        if (clientes[i].correoPrimario != null) {
          correos.push(clientes[i].correoPrimario);
        }
        if (clientes[i].correoSecundario != null) {
          correos.push(clientes[i].correoSecundario);
        }
        let telefonos:any = [];
        if (clientes[i].telefonoPrimario != null) {
          telefonos.push(clientes[i].telefonoPrimario);
        }
        if (clientes[i].telefonoSecundario != null) {
          telefonos.push(clientes[i].telefonoSecundario);
        }

        let clienteFormatted:any = {
          id: clientes[i].id,
          tipo: esClientePersona(clientes[i])?'persona':'empresa',
          nombres: clientes[i].nombres,
          apellidos: clientes[i].apellidos,
          genero: clientes[i].genero,
          empresa: clientes[i].empresa,
          ruc: clientes[i].ruc,
          correo: correos,
          telefono: telefonos,
          estadoCliente: clientes[i].estado,
          intencionCompra: clientes[i].intencionCompra,
          numeroInteracciones: cantidadInteraccionesTotal,
          cantidadCierres: cantidadCierresTotal,
          observacion: clientes[i].observacion,
          direccion: clientes[i].direccion,
          web: clientes[i].web,
          interacciones: contadorInteracciones,
          ultimoProspecto: {
            id: ultimoProspecto.id,
            idCliente: ultimoProspecto.idCliente,
            // porcentajeCierre: ultimoProspecto.porcentajeCierre*100,
            prioridad: ultimoProspecto.prioridad,
            horaFechaCreacion: ultimoProspecto.horaFechaCreacion,
            // horaFechaContacto: ultimoProspecto.horaFechaContacto,
            estadoFinalizacion: ultimoProspecto.estadoFinalizacion,
            // comentario: ultimoProspecto.comentario,
            idEstadoEmbudoVenta: ultimoProspecto.idEstadoEmbudoVenta
          }
        };

        if (clientesFormatted.find((cliente:any)=> cliente.id == clienteFormatted) == null) {
          clientesFormatted.push(clienteFormatted);
        }
      }

      if (busquedaNumerica || filtroInterno != null) {
        if (filtroInterno == 'cantidadCierres') {
          if (direccionOrden == 'asc') {
            clientesFormatted.sort( (a:any,b:any) => {
              return a.cantidadCierres - b.cantidadCierres;
            });
          } else {
            clientesFormatted.sort( (a:any,b:any) => {
              return b.cantidadCierres - a.cantidadCierres;
            });
          }
        } else if (filtroInterno == 'numeroInteracciones') {
          if (direccionOrden == 'asc') {
            clientesFormatted.sort( (a:any,b:any) => {
              return a.numeroInteracciones - b.numeroInteracciones;
            });
          } else {
            clientesFormatted.sort( (a:any,b:any) => {
              return b.numeroInteracciones - a.numeroInteracciones;
            });
          }
        } else if (filtroInterno == 'interaccionCanales') {
          if (direccionOrden == 'asc') {
            clientesFormatted.sort( (a:any,b:any) => {
              return a.interacciones[consulta.orderCanal.orderBy] - b.interacciones[consulta.orderCanal.orderBy];
            });
          } else {
            clientesFormatted.sort( (a:any,b:any) => {
              return b.interacciones[consulta.orderCanal.orderBy] - a.interacciones[consulta.orderCanal.orderBy];
            });
          }
        }

        if (busquedaNumerica) {
          clientesFormatted = clientesFormatted.filter((cliente:any) => {
            return cliente.intencionCompra.toString().indexOf(consulta.search) != -1 || cliente.numeroInteracciones.toString().indexOf(consulta.search) != -1 || cliente.cantidadCierres.toString().indexOf(consulta.search) != -1 || (cliente.telefono && cliente.telefono.length > 0 && cliente.telefono[0].indexOf(consulta.search) != -1) || (cliente.ultimoProspecto.prioridad && cliente.ultimoProspecto.prioridad.toString().indexOf(consulta.search) != -1);
          });
        }
      }

      totalClientes = clientesFormatted.length;
      consultaLimit -= 1;
      clientesFormatted = clientesFormatted.filter((cliente:any, index:any) => {
        return index >= consultaOffset && index <= consultaLimit;
      });

      response = {
        message: 'OK',
        content: clientesFormatted,
        totalCount: totalClientes,
        page: consulta.page || 0
      }
      res.status(200).json(response)
    })
  },
  ObtenerInteraccionesPorCanal: (req: Request, res: Response) => {
    let response
    let usuarioId = req.body.decodedJWT.id;
    if (req.body.canal == null || req.body.idCliente == null) {
      response = {
        message: 'ERROR',
        content: 'Se necesita canal y cliente para buscar las interacciones'
      };
      res.status(200).json(response);
      return;
    }

    let idCliente = req.body.idCliente;
    let consulta = req.body.query || null;
    let consultaOffset = (consulta.page * consulta.pageSize) || 0;
    let consultaLimit = (consulta.page * consulta.pageSize) + consulta.pageSize;
    let filtroOrden:any = [[prospectosModel,'horaFechaCreacion', 'DESC'],['horaFechaInicio', 'DESC']];
    let direccionOrden:any = 'DESC';
    let busqueda:any = {};

    if (consulta != null && consulta.orderBy != null) {
      direccionOrden = consulta.orderDirection;
      switch (consulta.orderBy.field) {
        case "estado":
          filtroOrden.push(['estadoInteraccion', direccionOrden]);
          break;
        case "startDate":
          filtroOrden.push(['horaFechaInicio', direccionOrden]);
          break;
        case "endDate":
          filtroOrden.push(['horaFechaTermino', direccionOrden]);
          break;
        default:
          filtroOrden.push(['horaFechaInicio', direccionOrden]);
          break;
      }
    }

    if (consulta != null && consulta.search != null && consulta.search != '') {
      let query = 'LOWER(t_interacciones.comentario) LIKE "%'+consulta.search+'%" or t_interacciones.horaFechaInicio LIKE "%'+consulta.search+'%" or t_interacciones.horaFechaTermino LIKE "%'+consulta.search+'%"';

      if (consulta.search.indexOf('fe') != -1  || consulta.search.indexOf('al') != -1 || consulta.search.indexOf('ve') != -1) {
        query += ' or t_interacciones.estadoInteraccion = 1'
      } else if (consulta.search.indexOf('tr') != -1 || consulta.search.indexOf('en') != -1 || consulta.search.indexOf('ro') != -1) {
        query += ' or t_interacciones.estadoInteraccion = -1'
      } else if (consulta.search.indexOf('ne') != -1 || consulta.search.indexOf('gr') != -1 || consulta.search.indexOf('se') != -1) {
        query += ' or t_interacciones.estadoInteraccion = 0 '
      } else {
        query += ' or t_interacciones.estadoInteraccion LIKE "%'+consulta.search+'%"'
      }

      busqueda = {
        [Op.and]: [
          Sequelize.literal(query),
          {
            idUsuario: usuarioId,
            canal: consulta.canal || req.body.canal,
            eliminar: 0
          }
        ]
      }
    } else {
      busqueda = {
        idUsuario: usuarioId,
        canal: consulta.canal || req.body.canal,
        eliminar: 0
      }
    }

    prospectosModel.hasMany(interaccionesModel, {foreignKey: 'idProspecto'})
    interaccionesModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'})
    prospectosModel.hasMany(usuariosXProspectosModel, {foreignKey: 'idProspecto'})
    usuariosXProspectosModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'})
    interaccionesModel.findAll({
      order: filtroOrden,
      where: busqueda,
      include: [{
        attributes: ['horaFechaCreacion'],
        model: prospectosModel,
        where: { idCliente: idCliente },
        include: [{
          attributes: ['idUsuario'],
          model: usuariosXProspectosModel,
          where: { idUsuario: usuarioId }
        }],
      }],
      offset: consultaOffset,
      limit: consultaLimit,
      subQuery:false
    }).then((interacciones: any) => {
      contarInteraccionesPorCanal(busqueda, idCliente).then((totalCount:any) => {
        response = {
          message: 'OK',
          content: interacciones,
          totalCount: totalCount,
          page: consulta.page || 0
        }
        res.status(200).json(response)
      });
    })
  },
};

export const contarClientes:any = async (idUsuario?:any, filtros?:any) => {
  let limitesConsultas:any = {};
  if (idUsuario != null) {
    limitesConsultas = { idUsuario: idUsuario }
  }

  clientesModel.hasMany(usuariosXClientesModel, {foreignKey: 'idCliente'})
  usuariosXClientesModel.belongsTo(clientesModel, {foreignKey: 'idCliente'})
  let totalClientes = await clientesModel.count({
    where: filtros,
    include: [{
      model: usuariosXClientesModel,
      where: limitesConsultas,
      distinct: true
    }]
  })

  return totalClientes || 0;
};