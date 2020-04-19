import { NextFunction, Request, Response } from 'express';
import { t_usuarios, test_t_usuarios, t_credenciales, test_t_credenciales } from '../config/sequelize';
import { t_empresas_controller } from '../controllers/t_empresas';
import { obtenerUrlAutenticacion, generarTokenDeCodigo } from '../helpers/exchange_auth';

const crypto = require("crypto");
const nodemailer = require("nodemailer");

let usuariosModel:any;
let credencialesModel:any;
if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  usuariosModel= test_t_usuarios;
  credencialesModel= test_t_credenciales;
} else {
  usuariosModel= t_usuarios;
  credencialesModel= t_credenciales;
}

export const t_usuarios_controller = {
  Agregar: (req: Request, res: Response, next: NextFunction) => {
    let response
    let dataUsuarios: Object;
    let dataEmpresas: Object;
    if (req.body.empresa) {
      dataUsuarios = req.body.usuario;
      dataEmpresas = req.body.empresa;
    } else {
      dataUsuarios = req.body;
      dataEmpresas = {};
    }
    // @ts-ignore
    const correo = dataUsuarios.correo;
    // @ts-ignore
    usuariosModel.findAll({
      where: { correo }
    }).then((usuarios: any) => {
      if (usuarios.length === 0) {
        // @ts-ignore
        let usuario = usuariosModel.build(dataUsuarios);
        usuario.horaFechaCreacion = new Date();
        // @ts-ignore
        usuario.setSaltAndHash(dataUsuarios.password);
        usuario.save().then((usuarioCreado: any) => {
          let token = usuarioCreado.generateJWT();
          if (usuarioCreado && token) {
            let respuestaUsuario = {
              message: 'OK',
              content: usuarioCreado,
              token: token,
            };

            if(req.body.empresa) {
              response = {
                usuario: respuestaUsuario,
                empresa: req.body.empresaResponse,
              }
            } else {
              response = respuestaUsuario;
            }

            res.status(201).json(response);
          } else {
            response = {
              message: 'ERROR',
              content: 'Error al crear el usuario y/o token',
            };
            res.status(200).json(response)
          }
        });
      } else {
        response = {
          message: 'ERROR',
          // @ts-ignore
          content: `El usuario con email ${dataUsuarios.correo} ya existe`
        };
        res.status(200).json(response)
      }
    });
  },
  Login: (req: Request, res: Response) => {
    let response
    // @ts-ignore
    usuariosModel.findOne({
      where: {
        estaActivo: 1,
        password: req.body.password,
        correo: req.body.usuario
      }
    }).then((usuarioEncontrado: any) => {
      if (usuarioEncontrado != null) {
        let token = usuarioEncontrado.generateJWT();
        response = {
          message: 'OK',
          content: 'Ingreso correcto',
          token: token
        };
        res.status(200).json(response)
      } else {
        response = {
          message: 'ERROR',
          content: 'Correo o contraseña incorrectos. Intente nuevamente'
        };
        res.status(200).json(response)
      }
    }).catch((error:any)=> {
      console.log('Error => '+error)
    });
  },
  VerificarCredenciales: (req: Request, res: Response) => {
    let response
    let idUsuario = req.body.decodedJWT.id

    credencialesModel.findOne({
      where: {
        idUsuario: idUsuario
      }
    }).then((credencial: any) => {
      if (credencial != null && (credencial.AESClave != null || credencial.exchangeToken != null)) {
        response = {
          message: 'OK',
          content: true
        };
        res.status(200).json(response)
      } else {
        response = {
          message: 'OK',
          content: false
        };
        res.status(200).json(response)
      }
    }).catch((error:any)=> {
      console.log('Error => '+error)
    });
  },
  VerificarUsuario: (req: Request, res: Response) => {
    let response
    // @ts-ignore
    if (req.body.usuario == null || req.body.usuario.length < 6) {
      response = {
        message: 'ERROR',
        content: 'El nombre de usuario debe ser mayor a 6 caracteres'
      };
      res.status(200).json(response);
      return;
    }

    usuariosModel.findOne({
      where: {
        usuario: req.body.usuario
      }
    }).then((usuarioEncontrado: any) => {
      if (usuarioEncontrado == null) {
        response = {
          message: 'OK',
          content: 'Nombre de usuario disponible'
        };
        res.status(200).json(response)
      } else {
        response = {
          message: 'ERROR',
          content: 'Nombre de usuario no disponible'
        };
        res.status(200).json(response)
      }
    }).catch((error:any)=> {
      console.log('Error => '+error)
    });
  },
  ConectarPorExchange: (req: Request, res: Response) => {
    let response:any;
    let urlIngresar = obtenerUrlAutenticacion();

    response = {
      message: 'OK',
      content: urlIngresar
    };
    res.status(200).json(response);
  },
  ConexionExchangeExitosa: async (req: Request, res: Response) => {
    const codigo = req.query.code;
    let response:any;

    if (codigo) {
      try {
        const datosAutenticacion = await generarTokenDeCodigo(codigo);

        usuariosModel.hasOne(credencialesModel, {foreignKey: 'idUsuario'})
        credencialesModel.belongsTo(usuariosModel, {foreignKey: 'idUsuario'})
        let credencial:any;
        let existeCredencial = await credencialesModel.findOne({
          include: [{
            model: usuariosModel,
            where: {
              correo: datosAutenticacion.correo
            }
          }]
        });

        if (existeCredencial != null) {
          //TODO: esto no esta funcionando
          credencial = await credencialesModel.update({
            exchangeToken: datosAutenticacion.token,
            exchangeRefreshToken: datosAutenticacion.refresh_token,
            exchangeExpireTimestamp: datosAutenticacion.token_expires
          },{
             where: { id: existeCredencial.t_usuario.id }
          });
        } else {
          let usuarioActual = await usuariosModel.findOne({
            where: {
              correo: datosAutenticacion.correo
            }
          });
          credencial = await credencialesModel.create({
            idUsuario: usuarioActual.id,
            exchangeToken: datosAutenticacion.token,
            exchangeRefreshToken: datosAutenticacion.refresh_token,
            exchangeExpireTimestamp: datosAutenticacion.token_expires
          });
        }

        if (credencial) {
          response = {
            message: 'OK',
            content: datosAutenticacion.cookies
          };
          res.status(200).json(response);
        } else {
          response = {
            message: 'ERROR',
            content: 'No se pudieron guardar las credenciales'
          };
          res.status(200).json(response);
          return;
        }
      } catch (error) {
        console.log(error);
        response = {
          message: 'ERROR',
          content: 'Error generando el codigo'
        };
        res.status(200).json(response)
      }
    } else {
      response = {
        message: 'ERROR',
        content: 'Parametro perdido'
      };
      res.status(200).json(response);
    }
  },
  ConectarPorSMTP: (req: Request, res: Response) => {
    let response:any;
    let idUsuario:any = req.body.decodedJWT.id;

    if (req.body.smtpPuerto == null || req.body.smtpHost == null || req.body.smtpUsuario == null || req.body.smtpPassword == null) {
      response = {
        message: 'ERROR',
        content: 'Faltan datos para poder generar la conexion SMTP'
      };
      res.status(200).json(response);
      return;
    }

    let configuracionMail:any = {
        host: req.body.smtpHost,
        port: req.body.smtpPuerto,
        auth: {
            user: req.body.smtpUsuario,
            pass: req.body.smtpPassword
        }
    };

    let nodemailerPuente = nodemailer.createTransport(configuracionMail);
    nodemailerPuente.sendMail({
      from: req.body.smtpUsuario, // sender address
      to: "jean1993p@hotmail.com", // list of receivers
      subject: "Hello ✔", // Subject line
      text: "Hello world?", // plain text body
      html: "<b>Hello world?</b>" // html body
    }).then((correoEnviado:any) => {
      console.log(correoEnviado);

      usuariosModel.hasOne(credencialesModel, {foreignKey: 'idUsuario'});
      credencialesModel.belongsTo(usuariosModel, {foreignKey: 'idUsuario'});
      usuariosModel.findOne({
        where: { id: idUsuario },
        include: [{
          model: credencialesModel
        }]
      }).then((usuario:any) => {
        let AESClave = crypto.randomBytes(16).toString('hex');
        let funcionEncriptacion = crypto.createCipheriv('aes-256-cbc', AESClave, usuario.usuarioSalt);
        let password = funcionEncriptacion.update(req.body.smtpPassword, 'utf8', 'base64');
        password += funcionEncriptacion.final('base64');
        if (usuario.t_credenciale == null) {
          credencialesModel.create({
            idUsuario: idUsuario,
            AESClave: AESClave,
            SMTPPuerto: req.body.smtpPuerto,
            SMTPHost: req.body.smtpHost,
            SMTPUsuario: req.body.smtpUsuario,
            SMTPPassword: password
          }).then((credencialCreada:any) => {
            if (credencialCreada) {
              response = {
                message: 'OK',
                content: 'Conexión STMP Completa'
              };
              res.status(200).json(response);
              return;
            } else {
              response = {
                message: 'ERROR',
                content: 'Conexión STMP Incorrecta. Intente nuevamente o ponganse en contacto con soporte'
              };
              res.status(200).json(response);
              return;
            }
          });
        } else {
          credencialesModel.update({
            AESClave: AESClave,
            SMTPPuerto: req.body.smtpPuerto,
            SMTPHost: req.body.smtpHost,
            SMTPUsuario: req.body.smtpUsuario,
            SMTPPassword: password
          }, {
            where: { idUsuario: idUsuario }
          }).then((credencial:any) => {
            response = {
              message: 'OK',
              content: 'Conexión STMP Completa'
            };
            res.status(200).json(response);
            return;
          });
        }
      });
    }).catch((error:any) => {
      console.log(error);

      response = {
        message: 'ERROR',
        content: 'Los datos ingresados para generar la conexión STMP son incorrectos'
      };
      res.status(200).json(response);
      return;
    });
  }
};

export const existeUsuario = async (id:any) => {
  const foundUser = await usuariosModel.findOne({where: { id: id }});
  return foundUser != null;
};