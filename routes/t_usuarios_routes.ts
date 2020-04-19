import { Router } from 'express';
import { t_usuarios_controller } from '../controllers/t_usuarios';
import { t_empresas_controller } from '../controllers/t_empresas';
import { seguridad_middleware } from '../middlewares/seguridad'

const express = require('express');
const t_usuarios_router = express.Router();

t_usuarios_router.post('/usuarios/agregar', t_usuarios_controller.Agregar);
t_usuarios_router.post('/usuarios/ingreso_nuevo', t_empresas_controller.Agregar, t_usuarios_controller.Agregar);
t_usuarios_router.post('/usuarios/login', t_usuarios_controller.Login);
t_usuarios_router.post('/usuarios/verificar_usuario', t_usuarios_controller.VerificarUsuario);
t_usuarios_router.get('/usuarios/autorizado', t_usuarios_controller.ConexionExchangeExitosa);
t_usuarios_router.get('/usuarios/exchange_registrar', t_usuarios_controller.ConectarPorExchange);
t_usuarios_router.post('/usuarios/smtp_registrar', seguridad_middleware.VerificarJWTPost, t_usuarios_controller.ConectarPorSMTP);
t_usuarios_router.post('/usuarios/verificar_credenciales', seguridad_middleware.VerificarJWTPost, t_usuarios_controller.VerificarCredenciales);

module.exports = t_usuarios_router;