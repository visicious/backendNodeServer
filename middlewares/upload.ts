import { NextFunction, Request, Response } from 'express';

const multer  = require('multer');
// const storage = multer.diskStorage({
//   destination: function (req:any, file:any, cb:any) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req:any, file:any, cb:any) {
//     let extension = file.originalname.substr(-5).split('.');
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     cb(null, file.fieldname + '-' + uniqueSuffix+'.'+extension[extension.length-1])
//   }
// })


export const upload_middleware = {
  SubirArchivosPrivados: (req: Request, res: Response, next:NextFunction) => {
    const upload = multer({ 
      dest: 'uploads/'
    }).any();

    // @ts-ignore
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        console.log(err)
        return res.status(500).json(err)
      } else if (err) {
        console.log(err)
        return res.status(500).json(err)
      }
      next()
    })
  },
};