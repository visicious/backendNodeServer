import { Router } from 'express';
import { t_vista_clientes_controller } from '../controllers/t_vista_clientes';
import { seguridad_middleware } from '../middlewares/seguridad';

const express = require('express');
const t_vista_clientes_router = express.Router();

t_vista_clientes_router.post('/vista_clientes/obtener', seguridad_middleware.VerificarJWTPost, t_vista_clientes_controller.ObtenerTodos);
t_vista_clientes_router.post('/vista_clientes/interacciones/obtener_por_canal', seguridad_middleware.VerificarJWTPost, t_vista_clientes_controller.ObtenerInteraccionesPorCanal);

module.exports = t_vista_clientes_router