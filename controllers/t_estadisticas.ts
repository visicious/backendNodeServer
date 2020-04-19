import { NextFunction, Request, Response } from 'express';
import { Sequelize, t_empresas, test_t_empresas, t_usuarios, test_t_usuarios, t_prospectos, test_t_prospectos, t_clientes, test_t_clientes, t_interacciones, test_t_interacciones, t_metas, test_t_metas, test_t_usuarios_x_prospectos, t_usuarios_x_prospectos, test_t_usuarios_x_clientes, t_usuarios_x_clientes, test_t_estados_embudo_ventas, t_estados_embudo_ventas } from '../config/sequelize';
import { mesNumericoAMensual,sonFechasIguales } from '../helpers/fechas';

const { Op } = require("sequelize");
let metasModel:any;
let clientesModel:any;
let prospectosModel:any;
let interaccionesModel:any;
let usuariosXClientesModel:any;
let usuariosModel:any;
let usuariosXProspectosModel:any;
let estadosModel:any;
if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  metasModel = test_t_metas;
  usuariosModel = test_t_usuarios;
  clientesModel = test_t_clientes;
  prospectosModel = test_t_prospectos;
  interaccionesModel = test_t_interacciones;
  estadosModel = test_t_estados_embudo_ventas;
  usuariosXClientesModel = test_t_usuarios_x_clientes;
  usuariosXProspectosModel = test_t_usuarios_x_prospectos;
} else {
  metasModel = t_metas;
  usuariosModel = t_usuarios;
  clientesModel = t_clientes;
  prospectosModel = t_prospectos;
  interaccionesModel = t_interacciones;
  estadosModel = t_estados_embudo_ventas;
  usuariosXClientesModel = t_usuarios_x_clientes;
  usuariosXProspectosModel = t_usuarios_x_prospectos;
}

export const t_estadisticas_controller = {
  ObtenerMetas: (req: Request, res: Response) => {
    let response
    let usuarioId = req.body.decodedJWT.id;

    metasModel.findAll({
      where: {
        idUsuario: usuarioId,
        eliminar: 0
      }
    }).then((metas: any) => {
      if (metas != null) {
        let metasFormateadas = [];
        let metaFormateada:any;

        metasFormateadas = metas.map((meta:any) => {
          metaFormateada = {
            id: meta.id,
            idUsuario: meta.idUsuario,
            nombre: meta.nombre,
            valor: meta.valor,
            avance: meta.avance || 0,
            horaFechaCreacion: meta.horaFechaCreacion,
            horaFechaInicio: meta.horaFechaInicio,
            horaFechaTermino: meta.horaFechaTermino,
          };
          metaFormateada.progreso = parseFloat((meta.avance*100/meta.valor).toFixed(2));
          return metaFormateada;
        });

        response = {
          message: 'OK',
          content: metasFormateadas,
        };
        res.status(200).json(response)
      } else {
        response = {
          message: 'ERROR',
          content: 'Error al consultar por las metas del usuario'
        };
        res.status(200).json(response)
      }
    });
  },
  ObtenerTodos: (req: Request, res: Response) => {
    let response
    let usuarioId = req.body.decodedJWT.id;

    let filtroTemporal:any = null;
    let filtroInteracciones:any = null;

    if (req.body.filtroCanal != null) {
      filtroInteracciones = { canal: req.body.filtroCanal };
    }

    if (req.body.filtroTemporal != null) {
      switch (req.body.filtroTemporal.toLowerCase()) {
        case "mes":
          filtroTemporal = Sequelize.literal('t_prospectos.horaFechaCreacion > DATE_SUB(NOW(), INTERVAL 30 DAY)');
          break;
        case "semana":
          filtroTemporal = Sequelize.literal('t_prospectos.horaFechaCreacion > DATE_SUB(NOW(), INTERVAL 7 DAY)');
          break;
        default:
          filtroTemporal = null;
          break;
      }
    }

    clientesModel.hasMany(prospectosModel, {foreignKey: 'idCliente'})
    prospectosModel.belongsTo(clientesModel, {foreignKey: 'idCliente'})
    // estadosModel.hasOne(prospectosModel, {foreignKey: 'idEstadoEmbudoVenta'})
    // prospectosModel.belongsTo(estadosModel, {foreignKey: 'idEstadoEmbudoVenta'})
    prospectosModel.hasMany(interaccionesModel, {foreignKey: 'idProspecto'});
    interaccionesModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'});
    prospectosModel.hasMany(usuariosXProspectosModel, {foreignKey: 'idProspecto'});
    usuariosXProspectosModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'});
    prospectosModel.hasMany(interaccionesModel, {foreignKey: 'idProspecto'});
    interaccionesModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'});
    prospectosModel.findAll({
      where: filtroTemporal,
      order: [
        ['horaFechaCreacion', 'ASC'],
      ],
      include: [
        // {
        //   model: estadosModel,
        //   where: {
        //     idUsuario: req.body.decodedJWT.id
        //   }
        // },
        {
          model: clientesModel
        },
        {
          model: interaccionesModel,
          where: filtroInteracciones
        },
        {
          attributes: ["idUsuario"],
          model: usuariosXProspectosModel,
          where: { idUsuario: usuarioId }
        },
      ]
    }).then((prospectos: any) => {
      if (prospectos != null) {
        let tiempoDefault = 'mes';
        if (req.body.filtroTemporal != null) {
          tiempoDefault = req.body.filtroTemporal.toLowerCase();
        }
        let estadisticasFormateados = formatearEstadisticas(prospectos,tiempoDefault);

        response = {
          message: 'OK',
          content: estadisticasFormateados,
        };
        res.status(200).json(response);
      } else {
        response = {
          message: 'ERROR',
          content: 'Error al consultar por las estadísticas de prospectos'
        };
        res.status(200).json(response);
      }
    });
  },
  ObtenerTopVendedores: (req: Request, res: Response) => {
    let response

    usuariosModel.hasMany(usuariosXProspectosModel, {foreignKey: 'idUsuario'});
    usuariosXProspectosModel.belongsTo(usuariosModel, {foreignKey: 'idUsuario'});
    usuariosXProspectosModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'});
    prospectosModel.hasMany(usuariosXProspectosModel, {foreignKey: 'idProspecto'});
    usuariosModel.findAll({
      include:[{
        model: usuariosXProspectosModel,
        where: { idUsuarioCierre: { [Op.not]:  null } },
        include: [{
          model: prospectosModel
        }]
      }]
    }).then((usuariosCierres: any) => {
      if (usuariosCierres != null) {
        let usuariosFormateados:any = [];
        let usuarioFormateado:any;
        for (let i = 0; i < usuariosCierres.length; i++) {
          usuarioFormateado = {
            id: usuariosCierres[i].id,
            usuario: usuariosCierres[i],
            cantidad: 0
          };

          if (usuariosFormateados.find((usuario:any)=> usuario.id == usuariosCierres[i].id) == null) {
            usuarioFormateado.cantidad = usuarioFormateado.cantidad + 1;
            usuariosFormateados.push(usuarioFormateado);
          } else {
            usuariosFormateados = usuariosFormateados.map((usuario:any)=> {
              if (usuario.id == usuariosCierres[i].id && usuariosCierres[i].t_usuarios_x_prospectos != null && usuariosCierres[i].t_usuarios_x_prospectos[0].t_prospectos[0] == 'ganado') {
                usuario.cantidad = usuario.cantidad + 1;
              }
              return usuario;
            });
          }
        }

        // usuariosFormateados.sort((a:any, b:any) => {
        //   return a.usuario.t_usuarios_x_prospectos[0].t_prospectos[0] - a.usuario.t_usuarios_x_prospectos[0].t_prospectos[0];
        // });

        response = {
          message: 'OK',
          content: usuariosFormateados,
        };
        res.status(200).json(response)
      } else {
        response = {
          message: 'ERROR',
          content: 'Error al consultar por las ventas de los usuarios'
        };
        res.status(200).json(response)
      }
    });
  },
  ObtenerResumenMensual: (req: Request, res: Response) => {
    let response;
    let usuarioId = req.body.decodedJWT.id;
    let resumenMensual:any = {
      prospectosTotales: 0,
      prospectosAutogenerados: 0,
      prospectosPendientes: 0,
      prospectosGanados: 0,
      prospectosPerdidos: 0,
      interaccionesTotales: 0,
      interaccionesPositivas: 0,
      interaccionesNeutras: 0,
      interaccionesNegativas: 0
    };

    prospectosModel.hasMany(usuariosXProspectosModel, {foreignKey: 'idProspecto'});
    usuariosXProspectosModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'});
    estadosModel.hasMany(prospectosModel, {foreignKey: 'idEstadoEmbudoVenta'});
    prospectosModel.belongsTo(estadosModel, {foreignKey: 'idEstadoEmbudoVenta'});
    prospectosModel.hasMany(interaccionesModel, {foreignKey: 'idProspecto'});
    interaccionesModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'});
    estadosModel.findAll({
      where: { idUsuario: usuarioId }
    }).then((estados:any) => {
      if (estados != null && estados.length > 0) {
        let prospectosFinales:any = {}
        for(let k = 0; k < estados.length; k++) {
          prospectosFinales[estados[k].nombre] = 0;
        }
        resumenMensual.prospectosDetallados = prospectosFinales;

        prospectosModel.findAll({
          where: Sequelize.literal('(MONTH(t_prospectos.horaFechaCreacion)) = MONTH(NOW())'),
          include:[
          {
            model: usuariosXProspectosModel,
            where: {
              idUsuario: usuarioId
            },
          },
          {
            model: estadosModel,
            where: {
              idUsuario: usuarioId
            }
          },
          {
            model: interaccionesModel,
            where: {
              idUsuario: usuarioId
            },
          },
          ]
        }).then((prospectos: any) => {
          if (prospectos != null) {
            let prospectosTotales:any = [];
            for (let i = 0; i < prospectos.length; i++) {
              if (prospectosTotales.find((prospecto:any)=> prospecto.id == prospectos[i].id) == null) {
                prospectosTotales.push(prospectos[i]);
              }
            }

            for (let j = 0; j < prospectosTotales.length; j++) {
              //TODO: Cuando se coloque el idCreador, debe contabilizarse los autogenerados aqui
              if (prospectosTotales[j].estadoFinalizacion == 'pendiente') {
                resumenMensual.prospectosPendientes+= 1;
              }
              if (prospectosTotales[j].estadoFinalizacion == 'ganado') {
                resumenMensual.prospectosGanados+= 1;
              }
              if (prospectosTotales[j].estadoFinalizacion == 'perdido') {
                resumenMensual.prospectosPerdidos+= 1;
              }
              if (prospectosTotales[j].t_estados_embudo_venta.nombre in resumenMensual.prospectosDetallados) {
                resumenMensual.prospectosDetallados[prospectosTotales[j].t_estados_embudo_venta.nombre]++;
              }
              resumenMensual.interaccionesTotales += prospectosTotales[j].t_interacciones.length;

              for (let l = 0; l < prospectosTotales[j].t_interacciones.length; l++) {
                if (prospectosTotales[j].t_interacciones[l].estadoInteraccion === 0) {
                  resumenMensual.interaccionesNeutras+= 1;
                } else if (prospectosTotales[j].t_interacciones[l].estadoInteraccion === 1) {
                  resumenMensual.interaccionesPositivas+= 1;
                } else if (prospectosTotales[j].t_interacciones[l].estadoInteraccion === -1) {
                  resumenMensual.interaccionesNegativas+= 1;
                }
              }
            }

            resumenMensual.prospectosTotales = prospectosTotales.length;
            resumenMensual.prospectosAutogenerados = prospectosTotales.length;
            response = {
              message: 'OK',
              content: resumenMensual,
            };
            res.status(200).json(response)
          } else {
            response = {
              message: 'ERROR',
              content: 'Error al consultar su resume mensual'
            };
            res.status(200).json(response)
          }
        });
      } else {
        response = {
          message: 'OK',
          content: resumenMensual
        };
        res.status(200).json(response)
      }
    })
  },
  ObtenerResumenMensualInteraccion: (req: Request, res: Response) => {
    let response;
    let usuarioId = req.body.decodedJWT.id;
    let resumenMensualInteraccion:any = {
      prospectosTotales: {
        whatsapp: 0,
        telefono: 0,
        correo: 0
      },
      prospectosPendientes: {
        whatsapp: 0,
        telefono: 0,
        correo: 0
      },
      prospectosGanados: {
        whatsapp: 0,
        telefono: 0,
        correo: 0
      },
      prospectosPerdidos: {
        whatsapp: 0,
        telefono: 0,
        correo: 0
      },
      interaccionesNeutras: {
        whatsapp: 0,
        telefono: 0,
        correo: 0
      },
      interaccionesPositivas: {
        whatsapp: 0,
        telefono: 0,
        correo: 0
      },
      interaccionesNegativas: {
        whatsapp: 0,
        telefono: 0,
        correo: 0
      }
    };

    prospectosModel.hasMany(usuariosXProspectosModel, {foreignKey: 'idProspecto'});
    usuariosXProspectosModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'});
    estadosModel.hasMany(prospectosModel, {foreignKey: 'idEstadoEmbudoVenta'});
    prospectosModel.belongsTo(estadosModel, {foreignKey: 'idEstadoEmbudoVenta'});
    prospectosModel.hasMany(interaccionesModel, {foreignKey: 'idProspecto'});
    interaccionesModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'});
    estadosModel.findAll({
      where: { idUsuario: usuarioId }
    }).then((estados:any) => {
      if (estados != null && estados.length > 0) {
        let prospectosFinales:any = {}
        for(let k = 0; k < estados.length; k++) {
          resumenMensualInteraccion[estados[k].nombre] = {
            whatsapp: 0,
            telefono: 0,
            correo: 0
          };
        }

        prospectosModel.findAll({
          where: Sequelize.literal('(MONTH(t_prospectos.horaFechaCreacion)) = MONTH(NOW())'),
          include:[
          {
            model: usuariosXProspectosModel,
            where: {
              idUsuario: usuarioId
            },
          },
          {
            model: estadosModel,
            where: {
              idUsuario: usuarioId
            }
          },
          {
            model: interaccionesModel,
            where: {
              idUsuario: usuarioId
            },
          },
          ]
        }).then((prospectos: any) => {
          if (prospectos != null) {
            let prospectosTotales:any = [];
            for (let i = 0; i < prospectos.length; i++) {
              if (prospectosTotales.find((prospecto:any)=> prospecto.id == prospectos[i].id) == null) {
                prospectosTotales.push(prospectos[i]);
              }
            }

            for (let j = 0; j < prospectosTotales.length; j++) {
              for (let l = 0; l < prospectosTotales[j].t_interacciones.length; l++) {
                resumenMensualInteraccion.prospectosTotales[prospectosTotales[j].t_interacciones[l].canal] += 1;

                if (prospectosTotales[j].estadoFinalizacion == 'pendiente') {
                  resumenMensualInteraccion.prospectosPendientes[prospectosTotales[j].t_interacciones[l].canal] += 1;
                }
                if (prospectosTotales[j].estadoFinalizacion == 'ganado') {
                  resumenMensualInteraccion.prospectosGanados[prospectosTotales[j].t_interacciones[l].canal] += 1;
                }
                if (prospectosTotales[j].estadoFinalizacion == 'perdido') {
                  resumenMensualInteraccion.prospectosPerdidos[prospectosTotales[j].t_interacciones[l].canal] += 1;
                }

                if (prospectosTotales[j].t_estados_embudo_venta.nombre in resumenMensualInteraccion) {
                  resumenMensualInteraccion[prospectosTotales[j].t_estados_embudo_venta.nombre][prospectosTotales[j].t_interacciones[l].canal]++;
                }

                if (prospectosTotales[j].t_interacciones[l].estadoInteraccion === 0) {
                  resumenMensualInteraccion.interaccionesNeutras[prospectosTotales[j].t_interacciones[l].canal]++;
                } else if (prospectosTotales[j].t_interacciones[l].estadoInteraccion === 1) {
                  resumenMensualInteraccion.interaccionesPositivas[prospectosTotales[j].t_interacciones[l].canal]++;
                } else if (prospectosTotales[j].t_interacciones[l].estadoInteraccion === -1) {
                  resumenMensualInteraccion.interaccionesNegativas[prospectosTotales[j].t_interacciones[l].canal]++;
                }
              }
            }

            response = {
              message: 'OK',
              content: resumenMensualInteraccion,
            };
            res.status(200).json(response)
          } else {
            response = {
              message: 'ERROR',
              content: 'Error al consultar su resume mensual'
            };
            res.status(200).json(response)
          }
        });
      } else {
        response = {
          message: 'OK',
          content: resumenMensualInteraccion
        };
        res.status(200).json(response)
      }
    })
  },
  AgregarMetas: (req: Request, res: Response) => {
    let response;
    let usuarioId = req.body.decodedJWT.id;

    metasModel.create({
      idUsuario: usuarioId,
      nombre: req.body.objetivo,
      valor: req.body.valor,
      horaFechaCreacion: new Date(),
      eliminar: 0
    }).then((meta: any) => {
      if (meta) {
        response = {
          message: 'OK',
          content: meta
        }
        res.status(201).json(response)
      } else {
        response = {
          message: 'ERROR',
          content: 'Error al agregar meta'
        }
        res.status(200).json(response)
      }
    })
  },
  ActualizarAvanceMeta: (req: Request, res: Response) => {
    let response
    let idUsuario = req.body.decodedJWT.id;

    metasModel.update({
      avance: req.body.avance
    }, {
      where: {
        id: req.body.id,
        idUsuario: idUsuario
      }
    }).then((metaUpdated: any) => {
      response = {
        message: 'OK',
        content: metaUpdated
      }
      res.status(200).json(response)
    });
  },
  EliminarMeta: (req: Request, res: Response) => {
    let response
    let idUsuario = req.body.decodedJWT.id;

    metasModel.update({
      eliminar: 1
    }, {
      where: {
        id: req.body.id,
        idUsuario: idUsuario
      }
    }).then((metaUpdated: any) => {
      response = {
        message: 'OK',
        content: metaUpdated
      }
      res.status(200).json(response)
    });
  },
};

export const formatearEstadisticas = (prospectos:any, periodoTemporal:any) => {
  let estadisticasFormateadas:any = [];
  let estadisticaFormateada:any;
  let estadisticaActual:any;
  let cantidadDias:any = 0;
  let diasEtiquetas:any = [];

  switch (periodoTemporal) {
    case "mes":
      cantidadDias = 30;
      diasEtiquetas = obtenerEtiquetasDias(new Date(), null, cantidadDias);
      break;
    case "semana":
      cantidadDias = 7;
      diasEtiquetas = obtenerEtiquetasDias(new Date(), null, cantidadDias);
      break;
    default:
      break;
  }

  for (let j = 0; j < diasEtiquetas.length; j++) {
    estadisticasFormateadas.push({
      name: diasEtiquetas[j],
      ganados: 0,
      perdidos: 0,
      generados: 0
    });
  }

  for(let i = 0; i < prospectos.length; i++) {
    let fechaInicial = new Date(prospectos[i].horaFechaCreacion);
    let etiquetaDia = mesNumericoAMensual(fechaInicial.getMonth(),true)+'-'+fechaInicial.getDate().toString();
    estadisticasFormateadas = estadisticasFormateadas.map((estadistica:any) => {
      if (estadistica.name == etiquetaDia) {
        switch (prospectos[i].estadoFinalizacion) {
          case "ganado":
            estadistica.ganados++;
            break;
          case "perdido":
            estadistica.perdidos++;
            break;
          case "pendiente":
            estadistica.generados++;
            break;
          default:
            break;
        }
      }

      return estadistica;
    });
  }

  return estadisticasFormateadas;
};

const obtenerEtiquetasDias = (fechaInicio:any, fechaTermino:any, cantidadDias?:any) => {
  let response:any;
  let etiquetaFecha:any;
  let etiquetasFechas:any = [];
  let fechaInicial = new Date(fechaInicio);
  let cantidadDiasNumerico = parseInt(cantidadDias);

  if (fechaTermino == null) {
    if(cantidadDias != null && !isNaN(cantidadDiasNumerico)) {
      for(let i = 0; i < cantidadDiasNumerico; i++) {
        etiquetaFecha = (mesNumericoAMensual(fechaInicial.getMonth(),true))+'-'+fechaInicial.getDate().toString();
        etiquetasFechas.push(etiquetaFecha);
        fechaInicial.setDate(fechaInicial.getDate() - 1);
      }
    } else {
      throw {
        error: "Se necesita una fecha de termino(primer argumento) o la cantidad de días requeridos en formato numerico(segundo argumento)"
      };
      return;
    }
  } else {
    let fechaPosterior = new Date(fechaTermino);
    if (fechaPosterior < fechaInicial) {
      fechaPosterior = fechaInicial;
      fechaInicial = new Date(fechaTermino);
    }

    while (sonFechasIguales(fechaInicial, fechaPosterior)) {
      etiquetaFecha = (mesNumericoAMensual(fechaPosterior.getMonth(),true))+'-'+fechaPosterior.getDate().toString();
      etiquetasFechas.push(etiquetaFecha);
      fechaPosterior.setDate(fechaPosterior.getDate() - 1);
    }
  }

  return etiquetasFechas.reverse();
};