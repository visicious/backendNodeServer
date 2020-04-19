import { Router } from 'express';
import { t_planes_controller } from '../controllers/t_planes';

const express = require('express');
const t_planes_router = express.Router();

t_planes_router.post('/planes/agregar', t_planes_controller.Agregar);
t_planes_router.get('/planes/obtener/:id', t_planes_controller.Obtener);
t_planes_router.get('/planes/obtener', t_planes_controller.ObtenerTodos);

module.exports = t_planes_router;
