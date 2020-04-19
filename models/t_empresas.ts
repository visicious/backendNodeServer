/* jshint indent: 2 */
// tslint:disable
import { Sequelize, DataTypes } from 'sequelize';

export const t_empresas_model = (sequelize: Sequelize) => {
  const t_empresas_model = sequelize.define('t_empresas', {
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
    cantidadTrabajadores: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false
    },
    ruc: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: true
    },
    horaFechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    idEncargado: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: true
    }
  }, {
    tableName: 'empresas',
    timestamps: false,
  });

  return t_empresas_model;
};
