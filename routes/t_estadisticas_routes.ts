import { Router } from 'express';
import { t_estadisticas_controller } from '../controllers/t_estadisticas';
import { seguridad_middleware } from '../middlewares/seguridad';

const express = require('express');
const t_estadisticas_router = express.Router();

t_estadisticas_router.post('/estadisticas/obtener/metas', seguridad_middleware.VerificarJWTPost,t_estadisticas_controller.ObtenerMetas);
t_estadisticas_router.post('/estadisticas/agregar/metas', seguridad_middleware.VerificarJWTPost,t_estadisticas_controller.AgregarMetas);
t_estadisticas_router.post('/estadisticas/obtener', seguridad_middleware.VerificarJWTPost,t_estadisticas_controller.ObtenerTodos);
t_estadisticas_router.post('/estadisticas/obtener/top', seguridad_middleware.VerificarJWTPost,t_estadisticas_controller.ObtenerTopVendedores);
t_estadisticas_router.post('/estadisticas/actualizar/meta', seguridad_middleware.VerificarJWTPost,t_estadisticas_controller.ActualizarAvanceMeta);
t_estadisticas_router.post('/estadisticas/eliminar/meta', seguridad_middleware.VerificarJWTPost,t_estadisticas_controller.EliminarMeta);
t_estadisticas_router.post('/estadisticas/obtener/reporte_mensual', seguridad_middleware.VerificarJWTPost,t_estadisticas_controller.ObtenerResumenMensual);
t_estadisticas_router.post('/estadisticas/obtener/reporte_interacciones', seguridad_middleware.VerificarJWTPost,t_estadisticas_controller.ObtenerResumenMensualInteraccion);

module.exports = t_estadisticas_router