/* jshint indent: 2 */
// tslint:disable
import {Sequelize , DataTypes} from 'sequelize';

export var t_canales_model = (sequelize: Sequelize) => {
  var t_canales_model = sequelize.define('t_canales', {
    id: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    color: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    logo: {
      type: DataTypes.STRING(150),
      allowNull: false
    }
  }, {
    tableName: 'canales',
    timestamps: false,
  });
  return t_canales_model;
};
