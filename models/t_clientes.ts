/* jshint indent: 2 */
// tslint:disable
import {Sequelize , DataTypes} from 'sequelize';

export var t_clientes_model = (sequelize: Sequelize) => {
  var t_clientes_model = sequelize.define('t_clientes', {
    id: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombres: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    apellidos: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    genero: {
      type: DataTypes.STRING(2),
      allowNull: true
    },
    telefonoPrimario: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    telefonoSecundario: {
      type: DataTypes.STRING(20),
      allowNull: true
    },
    correoPrimario: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    correoSecundario: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    intencionCompra: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    estado: {
      type: DataTypes.STRING(40),
      allowNull: false
    },
    ruc: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: true
    },
    empresa: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    observacion: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    horaFechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: true
    },
    web: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'clientes',
    timestamps: false,
  });
  return t_clientes_model;
};
