import "isomorphic-fetch";
import { Client } from "@microsoft/microsoft-graph-client";
import { Request } from 'express';
import { refrescarTokenAcceso } from '../helpers/exchange_auth';

const fs = require('fs');
const crypto = require("crypto");
const nodemailer = require("nodemailer");

export const enviarCorreoExchange = async(req: Request, credencial:any) => {
  let response:any;
  let adjuntos:any = [];
  let adjunto:any;
  let contentBytes:any;
  let emails:any = [];
  if (typeof req.body.to == 'string') {
    emails.push(req.body.to);
  } else {
    emails = [...new Set(req.body.to)];
  }

  // @ts-ignore
  if (req.files != null) {
    // @ts-ignore
    for(let i = 0; i < req.files.length; i++) {
      // @ts-ignore
      let extension = req.files[i].originalname.substr(-5).split('.');

      try {
        // @ts-ignore
        contentBytes = fs.readFileSync(req.files[i].path);
        // @ts-ignore
        let buffer = Buffer.alloc(req.files[i].size,contentBytes).toString("base64");
        adjunto = {
          "@odata.type": "#Microsoft.OutlookServices.FileAttachment",
          // @ts-ignore
          "ContentType": req.files[i].mimetype,
          // @ts-ignore
          "Name": req.files[i].originalname,
          // @ts-ignore
          "Size": req.files[i].size,
          "ContentBytes": buffer
        };
        adjuntos.push(adjunto);
      } catch(err) {
        // @ts-ignore
        console.log('No hubo imagen guardada en el servidor con el nombre: '+req.files[i].originalname);
        console.log(err);
      }
    }
  }
  let expirationDate = new Date(credencial.exchangeExpireTimestamp);

  const autenticacion  = await refrescarTokenAcceso({
    token: credencial.exchangeToken,
    refresh_token: credencial.exchangeRefreshToken,
    token_expires: expirationDate.getTime()
  });

  const client = Client.init({
    authProvider: (done) => {
      done(null, autenticacion.token);
    }
  });

  const mail = {
    subject: req.body.subject,
    body: {
      content: req.body.body || "",
      contentType: "html",
    },
    toRecipients: emails.map((email:any) => {
      return {
        emailAddress: {
          address: email,
        }
      };
    }),
    Attachments: adjuntos 
  };

  try {
    const correoEnviado = await client.api("/me/sendMail").post({ message: mail });
    console.log(correoEnviado);
    
    response = {
      message: 'OK',
      content: 'Mensaje correctamente enviado'
    };

    return [correoEnviado, response];
  } catch(error) {
    console.log(error);
    
    if (error.statusCode == 500) {
      response = {
        message: 'ERROR',
        content: 'Limite máximo de envío de archivos alcanzado. Tamaño máximo: 5MB'
      };
    } else {
      response = {
        message: 'ERROR',
        content: 'No se pudo enviar el mensaje. Intentelo nuevamente o ponganse en contacto con soporte'
      };
    }

    return [error, response];
  }
};

export const enviarCorreoSMTP = async(req: Request, credencial:any) => {
  let response:any;
  let adjuntos:any = [];
  let adjunto:any;
  let contentBytes:any;
  let emails:any = [];
  if (typeof req.body.to == 'string') {
    emails.push(req.body.to);
  } else {
    emails = [...new Set(req.body.to)];
  }

  let functionDesencriptado = crypto.createDecipheriv('aes-256-cbc', credencial.AESClave, credencial.AESSalt);
  let SMTPPassword = functionDesencriptado.update(credencial.SMTPPassword, 'base64', 'utf8');

  let configuracionSMTP:any = {
    host: credencial.SMTPHost,
    port: credencial.SMTPPuerto,
    auth: {
      user: credencial.SMTPUsuario,
      pass: SMTPPassword + functionDesencriptado.final('utf8')
    }
  };

  // @ts-ignore
  if (req.files != null) {
    // @ts-ignore
    for(let i = 0; i < req.files.length; i++) {
      // @ts-ignore
      let extension = req.files[i].originalname.substr(-5).split('.');

      try {
        // @ts-ignore
        contentBytes = fs.readFileSync(req.files[i].path);
        // @ts-ignore
        let buffer = Buffer.alloc(req.files[i].size,contentBytes).toString("base64");
        adjunto = {
          // @ts-ignore
          "contentType": req.files[i].mimetype,
          // @ts-ignore
          "name": req.files[i].originalname,
          "content": buffer,
          "encoding": "base64"
        };
        adjuntos.push(adjunto);
      } catch(err) {
        // @ts-ignore
        console.log('No hubo imagen guardada en el servidor con el nombre: '+req.files[i].originalname);
        console.log(err);
      }
    }
  }

  let nodemailerPuente = nodemailer.createTransport(configuracionSMTP);

  try {
    const correoEnviado = await nodemailerPuente.sendMail({
      from: credencial.SMTPUsuario, // sender address
      to: emails.toString(), // list of receivers
      subject: req.body.subject, // Subject line
      html: req.body.body, // html body
      attachments: adjuntos
    })
    console.log(correoEnviado);
    
    response = {
      message: 'OK',
      content: 'Mensaje correctamente enviado'
    };

    return [correoEnviado, response];
  } catch(error) {
    console.log(error);
    
    response = {
      message: 'ERROR',
      content: 'No se pudo enviar el mensaje. Intentelo nuevamente o ponganse en contacto con soporte'
    };

    return [error, response];
  }
};