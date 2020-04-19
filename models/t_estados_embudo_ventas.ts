/* jshint indent: 2 */
// tslint:disable
import { Sequelize, DataTypes } from 'sequelize';

export const t_estados_embudo_ventas_model = (sequelize: Sequelize) => {
  const t_estados_embudo_ventas_model = sequelize.define('t_estados_embudo_ventas', {
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
    nombre: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    orden: {
      type: DataTypes.TINYINT,
      allowNull: false
    },
    horaFechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    horaFechaModificacion: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    tableName: 'estados_embudo_ventas',
    timestamps: false,
  });

  return t_estados_embudo_ventas_model;
};
