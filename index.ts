import { NextFunction, Request, Response } from 'express';
import { sequelize, test_sequelize } from './config/sequelize';

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
const isMultipart = /^multipart\//i;
const urlencodedMiddleware = bodyParser.urlencoded({ extended: false });
const jsonMiddleware = bodyParser.json();
require('dotenv').config();

//Routes
const t_planes_routes = require('./routes/t_planes_routes');
const t_empresas_routes = require('./routes/t_empresas_routes');
const t_usuarios_routes = require('./routes/t_usuarios_routes');
const t_clientes_routes = require('./routes/t_clientes_routes');
const t_tableros_routes = require('./routes/t_tableros_routes');
const t_prospectos_routes = require('./routes/t_prospectos_routes');
const t_estadisticas_routes = require('./routes/t_estadisticas_routes');
const t_interacciones_routes = require('./routes/t_interacciones_routes');
const t_vista_clientes_routes = require('./routes/t_vista_clientes_routes');
const t_estados_embudo_ventas_routes = require('./routes/t_estados_embudo_ventas_routes');


app.use(bodyParser.urlencoded({ extended: false }));
app.use( bodyParser.json());

const puerto = process.env.PORT || 3700;
app.use((req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header("Access-Control-Allow-Credentials", 'true');
  res.header('Access-Control-Allow-Headers', 'Origin,X-Requested-With,Content-Type,Accept,Content-type,Authorization,application/json');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  res.header('Allow', 'GET,PUT,POST,DELETE,OPTIONS');
  next();
});


app.use('/api', t_planes_routes);
app.use('/api', t_empresas_routes);
app.use('/api', t_usuarios_routes);
app.use('/api', t_clientes_routes);
app.use('/api', t_tableros_routes);
app.use('/api', t_prospectos_routes);
app.use('/api', t_estadisticas_routes);
app.use('/api', t_interacciones_routes);
app.use('/api', t_vista_clientes_routes);
app.use('/api', t_estados_embudo_ventas_routes);

if (process.env.NODE_ENV && process.env.NODE_ENV.localeCompare('test')) {
  app.listen(puerto, () => {
    console.log(`servidor coriendo en ${puerto}`);
    test_sequelize.sync({ force: false, logging: false }).then((respuesta: any) => {
      console.log('base de datos creada, conexion exitosa');
    }).catch((error: any) => {
      console.log(error);
      console.log('error al crear base de datos o conectarse al servidor');
    })
  });
}
else {
  app.listen(puerto, () => {
    console.log(`servidor coriendo en ${puerto}`);
    sequelize.sync({ force: false }).then((respuesta: any) => {
      console.log('base de datos creada, conexion exitosa');
    }).catch((error: any) => {
      console.log(error);
      console.log('error al crear base de datos o conectarse al servidor');
    })
  });
}

app.use('/', (req: any, res: any) => {
  for (let w = 1; w < 11 ; w++) {
    let topeMinimo = 1;
    let topeMaximo = 10;
    let porcentajeBuscado:any = w;
    porcentajeBuscado = porcentajeBuscado - topeMinimo;
    let paletaColores:any = [ [255, 3, 0], [255, 137, 3], [36, 95, 179], [0, 196, 219] ];
    let diferenciaColor:any = [];
    let colorFinal:any = [];
    let tamanoPaso:any = ((topeMaximo - topeMinimo)+1) / (paletaColores.length-1);
    if( tamanoPaso <= 1 ) {
      colorFinal = paletaColores[porcentajeBuscado]
    } else {
      let preIndiceColorBase = parseFloat(((porcentajeBuscado+1)/tamanoPaso).toFixed(4));
      let indiceColorBase = Math.floor(preIndiceColorBase);
      let indiceColorTope = indiceColorBase + 1;
      // console.log('base '+indiceColorBase)
      // console.log('tope '+indiceColorTope)
      // console.log('porcentaje '+porcentajeBuscado)
      // console.log('paso '+tamanoPaso)
      if (Number.isInteger(preIndiceColorBase) ) {
        colorFinal = paletaColores[preIndiceColorBase]
      } else if(indiceColorBase == 1 && indiceColorTope == 2) {
        for ( let i = 0; i < 3; i++) {
          diferenciaColor.push(Math.abs((paletaColores[0][i] - paletaColores[paletaColores.length-1][i]) / ((topeMaximo - topeMinimo)) ));
        }
        for ( let j = 0; j < diferenciaColor.length; j++) {
          colorFinal.push(Math.ceil(Math.abs(paletaColores[0][j] - diferenciaColor[j] * (porcentajeBuscado*1.2) )));
        }
      } else {
        for ( let i = 0; i < 3; i++) {
          diferenciaColor.push(Math.abs((paletaColores[indiceColorBase][i] - paletaColores[indiceColorTope][i]) / tamanoPaso));
        }
        for ( let j = 0; j < diferenciaColor.length; j++) {
          let componenteColor = paletaColores[indiceColorTope][j] - diferenciaColor[j] * ((indiceColorBase+1)*tamanoPaso - (porcentajeBuscado+1));
          colorFinal.push(Math.ceil(Math.abs(componenteColor)));
        }
      }
    }

    console.log(colorFinal);
  }

  res.send('holo')
})

export default app;
