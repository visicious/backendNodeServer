import { Router } from 'express';
import { t_empresas_controller } from '../controllers/t_empresas';

const express = require('express');
const t_empresas_router = express.Router();

t_empresas_router.post('/empresas/agregar', t_empresas_controller.Agregar);

module.exports = t_empresas_router