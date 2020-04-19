import { Router } from 'express';
import { t_prospectos_controller } from '../controllers/t_prospectos';
import { t_clientes_controller } from '../controllers/t_clientes';
import { seguridad_middleware } from '../middlewares/seguridad';

const express = require('express');
const t_prospectos_router = express.Router();

t_prospectos_router.post('/prospectos/agregar', seguridad_middleware.VerificarJWTPost, t_clientes_controller.Agregar, t_prospectos_controller.Agregar);
t_prospectos_router.get('/prospectos/obtener', t_prospectos_controller.ObtenerTodos);
t_prospectos_router.post('/prospectos/cambiar_estado', seguridad_middleware.VerificarJWTPost, t_prospectos_controller.CambiarEstado);
t_prospectos_router.post('/prospectos/cierre', seguridad_middleware.VerificarJWTPost, t_prospectos_controller.Cerrar);

module.exports = t_prospectos_router;
