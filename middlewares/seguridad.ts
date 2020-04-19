import { NextFunction, Request, Response } from 'express';

const jwt = require('jsonwebtoken');
export const seguridad_middleware = {
  VerificarJWTPost: (req: Request, res: Response, next:NextFunction) => {
    let response
    try {
      const decoded = jwt.verify(req.body.token, 'crm_node');
      req.body.decodedJWT = decoded;
      next();
      return;
    } catch(err) {
      response = {
        message: 'ERROR',
        content: 'Error de Autenticacion',
      };
      res.status(403).json(response)
      return;
    }
  },
};