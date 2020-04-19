/* jshint indent: 2 */
// tslint:disable
import { Sequelize, DataTypes } from 'sequelize';

export const t_interacciones_model = (sequelize: Sequelize) => {
  const t_interacciones_model = sequelize.define('t_interacciones', {
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
    idProspecto: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false
    },
    idCanal: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: true
    },
    canal: {
      type: DataTypes.STRING(70),
      allowNull: false
    },
    horaFechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    horaFechaInicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    horaFechaTermino: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estadoInteraccion: {
      type: DataTypes.SMALLINT,
      allowNull: false
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    eliminar: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'interacciones',
    timestamps: false,
  });

  return t_interacciones_model;
};
