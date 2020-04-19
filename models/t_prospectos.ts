/* jshint indent: 2 */
// tslint:disable
import { Sequelize, DataTypes } from 'sequelize';

export const t_prospectos_model = (sequelize: Sequelize) => {
  const t_prospectos_model = sequelize.define('t_prospectos', {
    id: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idCliente: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false
    },
    porcentajeCierre: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    prioridad: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    horaFechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    horaFechaContacto: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estadoFinalizacion: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    idEstadoEmbudoVenta: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false
    }
  }, {
    tableName: 'prospectos',
    timestamps: false,
  });

  return t_prospectos_model;
};
