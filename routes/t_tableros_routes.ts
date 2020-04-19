import { Router } from 'express';
import { t_tableros_controller } from '../controllers/t_tableros';
import { t_clientes_controller } from '../controllers/t_clientes';
import { t_prospectos_controller } from '../controllers/t_prospectos';
import { seguridad_middleware } from '../middlewares/seguridad';

const express = require('express');
const t_tableros_router = express.Router();

t_tableros_router.post('/tableros/obtener', seguridad_middleware.VerificarJWTPost, t_tableros_controller.Obtener);
t_tableros_router.post('/tableros/prospectos/editar', seguridad_middleware.VerificarJWTPost, t_tableros_controller.EditarProspecto);
t_tableros_router.post('/tableros/prospectos/agregar', seguridad_middleware.VerificarJWTPost,t_tableros_controller.AgregarProspecto, t_clientes_controller.Agregar, t_prospectos_controller.Agregar);

module.exports = t_tableros_router