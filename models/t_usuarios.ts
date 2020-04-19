/* jshint indent: 2 */
// tslint:disable
import { Sequelize, DataTypes } from 'sequelize';
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
export const t_usuarios_model = (sequelize: Sequelize) => {
  const t_usuarios_model = sequelize.define('t_usuarios', {
    id: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    apellidos: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    usuario: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    password: {
      type: DataTypes.STRING(128),
      allowNull: false
    },
    usuarioSalt: {
      type: DataTypes.STRING(16),
      allowNull: false
    },
    usuarioHash: {
      type: DataTypes.STRING(64),
      allowNull: false
    },
    token: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    horaFechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    correo: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    celular: {
      type: DataTypes.INTEGER({ length: 11 }),
      allowNull: true
    },
    imagen: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    estaActivo: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    rol: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    opcionVentanaMail: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    nivelesPrioridad: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    horaFechaInactivo: {
      type: DataTypes.DATE,
      allowNull: true
    },
    idEmpresa: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false
    },
    idPlan: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false
    }
  }, {
    tableName: 'usuarios',
    timestamps: false,
  });
   // @ts-ignore
  t_usuarios_model.prototype.setSaltAndHash = function (password: any) {
    // @ts-ignore
    this.usuarioSalt = crypto.randomBytes(16).toString('hex');
    // @ts-ignore
    this.usuarioHash = crypto.pbkdf2Sync(password, this.usuarioSalt, 1000, 64, 'sha512').toString('hex');
  };
  // @ts-ignore
  t_usuarios_model.prototype.validPassword = function (password: any) {
    // @ts-ignore
    let hash_temporal = crypto.pbkdf2Sync(password, this.usuarioSalt, 1000, 64, 'sha512').toString('hex');
    // @ts-ignore
    if (hash_temporal === this.usuarioHash) {
      return true;
    } else {
      return false;
    }
  }
  // @ts-ignore
  t_usuarios_model.prototype.generateJWT = function () {
    let payload = {
      // @ts-ignore
      id: this.id,
      timestamp: new Date() 
    }
    const token = jwt.sign(payload, 'crm_node', { expiresIn: '10h' }, { algorithm: 'RS256' });
    return token;
  }
  return t_usuarios_model;
};
