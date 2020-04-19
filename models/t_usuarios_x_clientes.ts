/* jshint indent: 2 */
// tslint:disable
import { Sequelize, DataTypes } from 'sequelize';
const jwt = require('jsonwebtoken');

export const t_usuarios_x_clientes_model = (sequelize: Sequelize) => {
  const t_usuarios_x_clientes_model = sequelize.define('t_usuarios_x_clientes', {
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
    idCliente: {
      type: DataTypes.INTEGER({length:11}),
      allowNull: false
    }
  }, {
    tableName: 'usuarios_x_clientes',
    timestamps: false,
  });
  // @ts-ignore
  t_usuarios_x_clientes_model.prototype.generateJWT = function () {
    let payload = {
      // @ts-ignore
      id: this.idUsuario,
      timestamp: new Date() 
    }
    const token = jwt.sign(payload, 'crm_node', { expiresIn: '10h' }, { algorithm: 'RS256' });
    return token;
  }

  return t_usuarios_x_clientes_model;
};
