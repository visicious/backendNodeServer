import { NextFunction, Request, Response } from 'express';
import { Sequelize, test_t_clientes, t_clientes, test_t_interacciones, t_interacciones, test_t_prospectos, t_prospectos, test_t_estados_embudo_ventas, t_estados_embudo_ventas } from '../config/sequelize';
import { calcularTiempoSinContacto } from './t_prospectos';
import { contarInteracciones } from './t_interacciones';

const jwt = require('jsonwebtoken');
let clientesModel:any;
let estadosModel:any;
let prospectosModel:any;
let interaccionesModel:any;
if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  estadosModel= test_t_estados_embudo_ventas;
  prospectosModel= test_t_prospectos;
  clientesModel= test_t_clientes;
  interaccionesModel= test_t_interacciones;
} else {
  estadosModel= t_estados_embudo_ventas;
  prospectosModel= t_prospectos;
  clientesModel= t_clientes;
  interaccionesModel= t_interacciones;
}

export const t_tableros_controller = {
  Obtener: (req: Request, res: Response, next:NextFunction) => {
    let response
    // try {
    //   const decoded = jwt.verify(req.body.token, 'crm_node');
    // } catch(err) {
    //     response = {
    //         message: 'ERROR',
    //         content: 'Error de Autenticacion',
    //     };
    //     res.status(403).json(response)
    //     return;
    // }

    clientesModel.hasMany(prospectosModel, {foreignKey: 'idCliente'})
    prospectosModel.belongsTo(clientesModel, {foreignKey: 'idCliente'})
    estadosModel.hasOne(prospectosModel, {foreignKey: 'idEstadoEmbudoVenta'})
    prospectosModel.belongsTo(estadosModel, {foreignKey: 'idEstadoEmbudoVenta'})
    prospectosModel.hasMany(interaccionesModel, {foreignKey: 'idProspecto'});
    interaccionesModel.belongsTo(prospectosModel, {foreignKey: 'idProspecto'});
    prospectosModel.findAll({
      where: { estadoFinalizacion: 'pendiente' },
       order: [
        ['prioridad', 'ASC'],
      ],
      include: [
        {
          model: estadosModel,
          where: {
            idUsuario: req.body.decodedJWT.id
          }
        },
        {
          model: clientesModel
        },
        {
          model: interaccionesModel
        }
      ]
    }).then((prospectos: any) => {
      let tablero:any = {
        cards: {},
        columns: {},
        columnOrder: []
      }
      let cardsGroupByColumns:any = {};

      for(let i = 0; i < prospectos.length; i++) {
        tablero.cards['prospecto-'+prospectos[i].id.toString()] = {
          id: 'prospecto-'+prospectos[i].id.toString(),
          content: convertirProspectoFormatoTablero(prospectos[i], prospectos[i].t_cliente)
        };

        if (!(prospectos[i].idEstadoEmbudoVenta in cardsGroupByColumns)) {
          cardsGroupByColumns[prospectos[i].idEstadoEmbudoVenta] = [];
        }
        cardsGroupByColumns[prospectos[i].idEstadoEmbudoVenta].push('prospecto-'+prospectos[i].id.toString());
      }

      estadosModel.findAll({
        where: {
          idUsuario: req.body.decodedJWT.id
        },
        order: [
          ['orden', 'ASC'],
        ]
      }).then((estados:any)=> {
        let columns:any = {};
        for(let i = 0; i < estados.length; i++) {
          let column:any = {
            id: 'estado-'+estados[i].id.toString(),
            title: estados[i].nombre,
          };

          if (estados[i].id in cardsGroupByColumns) {
            column['cardIds'] = JSON.parse(JSON.stringify(cardsGroupByColumns[estados[i].id]));
          } else {
            column['cardIds'] = [];
          }

          columns['estado-'+estados[i].id.toString()] = column;
          tablero.columnOrder.push('estado-'+estados[i].id.toString());
        }
        tablero.columns = JSON.parse(JSON.stringify(columns));
        response = {
          message: 'OK',
          content: tablero
        }
        res.status(200).json(response)
      });
    })
  },
  EditarProspecto: (req: Request, res: Response) => {
    let response:any;
    let clienteDatos:any;
    let prospectoDatos:any;

    prospectoDatos = {
      prioridad: req.body.prioridad,
      porcentajeCierre: (req.body.porcentajeCierre || 0)/100,
    }
    if (req.body.fechaContacto != '' && req.body.fechaContacto != null) {
      let horaFechaContactoInput = new Date(req.body.fechaContacto);
      let horaFechaActual = new Date();
      if (horaFechaContactoInput <= horaFechaActual) {
        prospectoDatos.horaFechaContacto = horaFechaContactoInput;
      }
    }

    if (req.body.tipo == null) {
      response = {
        message: 'ERROR',
        content: 'Datos mal enviados'
      }
      res.status(200).json(response)
      return;
    }
    if (req.body.tipo == 'persona') {
      clienteDatos = {
        nombres: req.body.nombres,
        apellidos: req.body.apellidos,
        genero: req.body.genero,
      }
    } else {
      clienteDatos = {
        empresa: req.body.empresa,
        ruc: req.body.ruc,
      }
    }
    clienteDatos['correoPrimario'] = req.body.correo[0] || null;
    clienteDatos['correoSecundario'] = req.body.correo[1] || null;
    clienteDatos['telefonoPrimario'] = req.body.telefono[0] || null;
    clienteDatos['telefonoSecundario'] = req.body.telefono[1] || null;

    prospectosModel.update(prospectoDatos, {
      where:{ id: req.body.id }
    }).then((prospectoUpdate: any) => {
      // prospectoUpdate == 0, no hizo el update ya sea por error o por datos
      // que no cambiaron
      clientesModel.update(clienteDatos, {
        where: { id: req.body.idCliente }
      }).then((clienteUpdate: any) => {
        // clienteUpdate == 0, no hizo el update ya sea por error o por datos
        // que no cambiaron
        response = {
          message: 'OK',
          prospecto: prospectoUpdate,
          cliente: clienteUpdate,
        }

        clientesModel.hasMany(prospectosModel, {foreignKey: 'idCliente'});
        prospectosModel.belongsTo(clientesModel, {foreignKey: 'idCliente'});
        prospectosModel.findByPk(req.body.id, {
          include: [ clientesModel ]
        }).then((prospecto:any)=> {
          response.content = convertirProspectoFormatoTablero(prospecto, prospecto.t_cliente);
          res.status(200).json(response)
        });
      });
    })
  },
  AgregarProspecto: (req: Request, res: Response, next:NextFunction) => {
    req.body.formatProspecto = 'tablero';
    next();
  },
};

export const convertirProspectoFormatoTablero = (prospecto:any, cliente:any, header?:any) => {
  let correos:any = [];
  if (cliente.correoPrimario != null) {
    correos.push(cliente.correoPrimario);
  }
  if (cliente.correoSecundario != null) {
    correos.push(cliente.correoSecundario);
  }
  if (cliente.correo != null) {
    correos.push(cliente.correo);
  }

  let telefonos:any = [];
  if (cliente.telefonoPrimario != null) {
    telefonos.push(cliente.telefonoPrimario);
  }
  if (cliente.telefonoSecundario != null) {
    telefonos.push(cliente.telefonoSecundario);
  }
  if (cliente.telefono != null) {
    telefonos.push(cliente.telefono);
  }

  let contadorInteracciones:any = {
    whatsapp: 0,
    telefono: 0,
    correo: 0
  }
  if (prospecto.t_interacciones != null) {
    contadorInteracciones.telefono = prospecto.t_interacciones.filter((interaccion:any)=>{
      return interaccion.canal == 'telefono' && interaccion.eliminar == 0;
    }).length;
    contadorInteracciones.whatsapp = prospecto.t_interacciones.filter((interaccion:any)=>{
      return interaccion.canal == 'whatsapp' && interaccion.eliminar == 0;
    }).length;
    contadorInteracciones.correo = prospecto.t_interacciones.filter((interaccion:any)=>{
      return interaccion.canal == 'correo' && interaccion.eliminar == 0;
    }).length;
  }

  let tarjetaActualizada = {
    id: prospecto.id,
    idCliente: prospecto.idCliente,
    tipo: '',
    empresa: cliente.empresa || '',
    ruc: cliente.ruc || null,
    genero: cliente.genero || '',
    nombres: cliente.nombres || '',
    apellidos: cliente.apellidos || '',
    titulo: '',
    correo: correos,
    telefono: telefonos,
    prioridad: prospecto.prioridad,
    prioridadColor: 'yellow',
    prioridadColorText: 'black',
    tiempoSinContacto: '',
    tiempoSinContactoNumber: 0,
    fechaContacto: prospecto.horaFechaContacto || null,
    porcentajeCierre: (prospecto.porcentajeCierre*100).toFixed(0),
    porcentajeColor: '#66fe00',
    idEstadoEmbudoVenta: prospecto.idEstadoEmbudoVenta,
    estadoFinalizacion: prospecto.estadoFinalizacion,
    interacciones: contadorInteracciones
  }

  if (prospecto.horaFechaContacto != null) {
    [ tarjetaActualizada.tiempoSinContacto , tarjetaActualizada.tiempoSinContactoNumber ] = calcularTiempoSinContacto(prospecto.horaFechaContacto);
  } else {
    [ tarjetaActualizada.tiempoSinContacto , tarjetaActualizada.tiempoSinContactoNumber ] = calcularTiempoSinContacto(prospecto.horaFechaCreacion);
  }

  if (tarjetaActualizada.genero != '' && tarjetaActualizada.nombres != '' && tarjetaActualizada.apellidos != '') {
    tarjetaActualizada.tipo = 'persona';
    tarjetaActualizada.titulo = cliente.nombres+' '+cliente.apellidos;
  } else {
    tarjetaActualizada.tipo = 'empresa';
    tarjetaActualizada.titulo = cliente.empresa;
  }

  if (header != null) {
    return  {
      id: `prospecto-${prospecto.id}`,
      content: tarjetaActualizada
    }
  } else {
    return tarjetaActualizada;
  }
};
