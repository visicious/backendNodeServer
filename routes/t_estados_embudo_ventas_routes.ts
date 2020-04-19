import { Router } from 'express';
import { t_estados_embudo_ventas_controller } from '../controllers/t_estados_embudo_ventas';
import { seguridad_middleware } from '../middlewares/seguridad';

const express = require('express');
const t_estados_embudo_ventas_router = express.Router();

t_estados_embudo_ventas_router.post('/estados_embudo/agregar', seguridad_middleware.VerificarJWTPost, t_estados_embudo_ventas_controller.Agregar);
t_estados_embudo_ventas_router.get('/estados_embudo/obtener', t_estados_embudo_ventas_controller.ObtenerTodos);

module.exports = t_estados_embudo_ventas_router