/* jshint indent: 2 */
// tslint:disable
import { Sequelize, DataTypes } from 'sequelize';

export const t_medios_comunicacion_clientes_model = (sequelize: Sequelize) => {
  const t_medios_comunicacion_clientes_model = sequelize.define('t_medios_comunicacion_clientes', {
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
    idCanal: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    valor: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    estaActivo: {
      type: DataTypes.TINYINT,
      allowNull: false
    }
  }, {
    tableName: 'medios_comunicacion_clientes',
    timestamps: false,
  });

  return t_medios_comunicacion_clientes_model;
};
