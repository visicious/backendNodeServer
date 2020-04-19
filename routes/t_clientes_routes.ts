import { Router } from 'express';
import { t_clientes_controller } from '../controllers/t_clientes';
import { seguridad_middleware } from '../middlewares/seguridad';

const express = require('express');
const t_clientes_router = express.Router();

t_clientes_router.post('/clientes/agregar', seguridad_middleware.VerificarJWTPost,t_clientes_controller.Agregar);
t_clientes_router.post('/clientes/obtener_correos', seguridad_middleware.VerificarJWTPost,t_clientes_controller.ObtenerCorreosTodos);
t_clientes_router.post('/clientes/obtener_telefonos', seguridad_middleware.VerificarJWTPost,t_clientes_controller.ObtenerTelefonosTodos);
t_clientes_router.get('/clientes/obtener/:id', t_clientes_controller.ObtenerTodos);

module.exports = t_clientes_router