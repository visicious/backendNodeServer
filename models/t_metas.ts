/* jshint indent: 2 */
// tslint:disable
import {Sequelize , DataTypes} from 'sequelize';

export var t_metas_model = (sequelize: Sequelize) => {
  var t_metas_model = sequelize.define('t_metas', {
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
      type: DataTypes.STRING(150),
      allowNull: false
    },
    valor: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    avance: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    horaFechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    horaFechaInicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    horaFechaTermino: {
      type: DataTypes.DATE,
      allowNull: true
    },
    eliminar: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    }
  }, {
    tableName: 'metas',
    timestamps: false,
  });
  return t_metas_model;
};
