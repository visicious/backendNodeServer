/* jshint indent: 2 */
// tslint:disable
import { Sequelize, DataTypes } from 'sequelize';

export const t_planes_model = (sequelize: Sequelize) => {
  const t_planes_model = sequelize.define('t_planes', {
    id: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    costo: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    beneficios: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    tableName: 'planes',
    timestamps: false,
  });

  return t_planes_model;
};
