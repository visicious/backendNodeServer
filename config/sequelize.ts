import { t_canales_model } from "../models/t_canales";
import { t_clientes_model } from "../models/t_clientes";
import { t_empresas_model } from "../models/t_empresas";
import { t_estados_embudo_ventas_model } from "../models/t_estados_embudo_ventas";
import { t_interacciones_model } from "../models/t_interacciones";
import { t_medios_comunicacion_clientes_model } from "../models/t_medios_comunicacion_clientes";
import { t_planes_model } from "../models/t_planes";
import { t_prospectos_model } from "../models/t_prospectos";
import { t_usuarios_model } from "../models/t_usuarios";
import { t_usuarios_x_prospectos_model } from "../models/t_usuarios_x_prospectos";
import { t_usuarios_x_clientes_model } from "../models/t_usuarios_x_clientes";
import { t_credenciales_model } from "../models/t_credenciales";
import { t_metas_model } from "../models/t_metas";


export const Sequelize = require('sequelize');

export const sequelize = new Sequelize('crm_almacen', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-05:00',
  logging: console.log
});
export const t_canales = t_canales_model(sequelize);
export const t_clientes = t_clientes_model(sequelize);
export const t_empresas = t_empresas_model(sequelize);
export const t_estados_embudo_ventas = t_estados_embudo_ventas_model(sequelize);
export const t_interacciones = t_interacciones_model(sequelize);
export const t_medios_comunicacion_clientes = t_medios_comunicacion_clientes_model(sequelize);
export const t_planes = t_planes_model(sequelize);
export const t_prospectos = t_prospectos_model(sequelize);
export const t_usuarios = t_usuarios_model(sequelize);
export const t_usuarios_x_prospectos = t_usuarios_x_prospectos_model(sequelize);
export const t_usuarios_x_clientes = t_usuarios_x_clientes_model(sequelize);
export const t_credenciales = t_credenciales_model(sequelize);
export const t_metas = t_metas_model(sequelize);

export const test_sequelize = new Sequelize('test_crm_almacenes', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
  timezone: '-05:00'
});
export const test_t_canales = t_canales_model(test_sequelize);
export const test_t_clientes = t_clientes_model(test_sequelize);
export const test_t_empresas = t_empresas_model(test_sequelize);
export const test_t_estados_embudo_ventas = t_estados_embudo_ventas_model(test_sequelize);
export const test_t_interacciones = t_interacciones_model(test_sequelize);
export const test_t_medios_comunicacion_clientes = t_medios_comunicacion_clientes_model(test_sequelize);
export const test_t_planes = t_planes_model(test_sequelize);
export const test_t_prospectos = t_prospectos_model(test_sequelize);
export const test_t_usuarios = t_usuarios_model(test_sequelize);
export const test_t_usuarios_x_prospectos = t_usuarios_x_prospectos_model(test_sequelize);
export const test_t_usuarios_x_clientes = t_usuarios_x_clientes_model(test_sequelize);
export const test_t_credenciales = t_credenciales_model(sequelize);
export const test_t_metas = t_metas_model(sequelize);