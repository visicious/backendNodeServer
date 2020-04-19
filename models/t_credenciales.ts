/* jshint indent: 2 */
// tslint:disable
import {Sequelize , DataTypes} from 'sequelize';

export var t_credenciales_model = (sequelize: Sequelize) => {
  var t_credenciales_model = sequelize.define('t_credenciales', {
    id: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idUsuario: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false
    },
    AESClave: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exchangeToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exchangeRefreshToken: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    exchangeExpireTimestamp: {
      type: DataTypes.DATE,
      allowNull: true
    },
    SMTPPuerto: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: true
    },
    SMTPHost: {
      type: DataTypes.STRING(250),
      allowNull: true
    },
    SMTPUsuario: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    SMTPPassword: {
      type: DataTypes.STRING(100),
      allowNull: true
    }
  }, {
    tableName: 'credenciales',
    timestamps: false,
  });
  return t_credenciales_model;
};
