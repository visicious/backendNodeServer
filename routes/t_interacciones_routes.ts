import { Router } from 'express';
import { t_interacciones_controller } from '../controllers/t_interacciones';
import { seguridad_middleware } from '../middlewares/seguridad';
import { upload_middleware } from '../middlewares/upload';

const express = require('express');

const t_interacciones_router = express.Router();

t_interacciones_router.post('/interacciones/agregar', seguridad_middleware.VerificarJWTPost,t_interacciones_controller.Agregar);
t_interacciones_router.post('/interacciones/editar', seguridad_middleware.VerificarJWTPost,t_interacciones_controller.Editar);
t_interacciones_router.post('/interacciones/eliminar', seguridad_middleware.VerificarJWTPost,t_interacciones_controller.Eliminar);
t_interacciones_router.post('/interacciones/colocar_termino', seguridad_middleware.VerificarJWTPost,t_interacciones_controller.ColocarFechaTermino);
t_interacciones_router.post('/interacciones/obtener_por_canal', seguridad_middleware.VerificarJWTPost, t_interacciones_controller.ObtenerTodosPorCanal);
t_interacciones_router.post('/interacciones/generar_interaccion/correo', upload_middleware.SubirArchivosPrivados, seguridad_middleware.VerificarJWTPost, t_interacciones_controller.GenerarInteraccionCorreo);
t_interacciones_router.post('/interacciones/generar_interaccion_global/correo', upload_middleware.SubirArchivosPrivados, seguridad_middleware.VerificarJWTPost, t_interacciones_controller.GenerarInteraccionCorreoGlobal);
t_interacciones_router.post('/interacciones/generar_interaccion/whatsapp', upload_middleware.SubirArchivosPrivados, seguridad_middleware.VerificarJWTPost, t_interacciones_controller.GenerarInteraccionWhatsapp);

module.exports = t_interacciones_router;
