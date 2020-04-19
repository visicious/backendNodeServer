import app from '../../index';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import 'mocha';
import { test_t_clientes, test_t_usuarios, test_t_estados_embudo_ventas, test_t_prospectos } from '../../config/sequelize';


chai.should();
chai.use(chaiHttp);


describe('Rutas de Tablero', () => {
  let testToken:any;

  before(async () => {
    test_t_usuarios.destroy({
      where: {},
      truncate: true
    });
    test_t_prospectos.destroy({
      where: {},
      truncate: true
    });
    test_t_clientes.destroy({
      where: {},
      truncate: true
    });
    // @ts-ignore
    let dataUsuario = {
      nombres: "Joel",
      apellidos: "Valdez",
      usuario: "jo3lv4ld3z",
      password: "123456789",
      correo: "jean1993p@hotmail.com",
      celular: 959356464,
      imagen: "fotos_usuario/foto.jpg",
      estaActivo: 1,
      rol: "administrador",
      opcionVentanaMail: 7,
      nivelesPrioridad: 5,
      idEmpresa: 1,
      idPlan: 1
    };
    // @ts-ignore
    let usuario = test_t_usuarios.build(dataUsuario);
    // @ts-ignore
    usuario.horaFechaCreacion = new Date();
    // @ts-ignore
    usuario.setSaltAndHash(dataUsuario.password);
    // @ts-ignore

    let persona:any = {
      intencionCompra: 0,
      estado: 'prospecto',
      observacion: '',
      horaFechaCreacion: new Date(),
      nombres: "Alfonso",
      apellidos: "Santisteban",
      genero: "H",
    }

    let prospectoPersona:any = {
      idCliente: 1,
      porcentajeCierre: 0.15,
      prioridad: 5,
      horaFechaCreacion: new Date(),
      estadoFinalizacion: 'pendiente',
      idEstadoEmbudoVenta: 1
    }

    // @ts-ignore
    let testUsuario = await usuario.save();
    // @ts-ignore
    let testCliente = await test_t_clientes.create(persona);
    // @ts-ignore
    let testProspecto = await test_t_prospectos.create(prospectoPersona);
    if (testUsuario) {
      testToken = testUsuario.generateJWT();
      console.log(testToken)
      console.log('Entorno preparado para las pruebas')

    } else {
      console.error('Error agregando plan previo a la configuracion')
    }
  });

  describe('/GET api/tablero/obtener/:id cuando esta vacío', () => {
    it('debería retornar un objeto vacio por GET', (done) => {
      chai.request(app)
      .get('/api/tablero/obtener/10')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
    })
  })

  describe('/POST api/tableros/prospectos/agregar (1 elementos en la base de datos)', () => {
    it('debería agregar un prospecto y un cliente tipo empresa por POST', (done) => {
      chai.request(app)
      .post('/api/tableros/prospectos/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "prospecto": {
          "porcentajeCierre": 78,
          "prioridad": 3,
          "idEstadoEmbudoVenta": 4,
        },
        "cliente": {
          "empresa": "Inteligentes SAC",
          "ruc": 15646432120,
          "direccion": "Urb Manzana Roja, Calle Tobaco 13",
          "web": "and.all.ju.jim@hotmail.com",
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.prospecto.message.should.be.eql('OK')
        res.body.prospecto.content.idCliente.should.be.eql(res.body.cliente.content.id)
        res.body.prospecto.content.porcentajeCierre.should.be.eql(0.78)
        res.body.prospecto.content.prioridad.should.be.eql(3)
        res.body.prospecto.content.idEstadoEmbudoVenta.should.be.eql(4)
        res.body.prospecto.content.horaFechaCreacion.should.be.a('string')
        res.body.prospecto.content.estadoFinalizacion.should.be.eql('pendiente')
        res.body.cliente.message.should.be.eql('OK')
        res.body.cliente.content.nombres.should.be.eql("")
        res.body.cliente.content.apellidos.should.be.eql('')
        res.body.cliente.content.genero.should.be.eql('')
        res.body.cliente.content.direccion.should.be.eql('Urb Manzana Roja, Calle Tobaco 13')
        res.body.cliente.content.empresa.should.be.eql('Inteligentes SAC')
        res.body.cliente.content.ruc.should.be.eql(15646432120)
        res.body.cliente.content.web.should.be.eql('and.all.ju.jim@hotmail.com')
        done()
      })
    })
  })

  describe('/GET api/tableros/prospectos/editar con data valida de cliente', () => {
    it('debería responder con la actualizacion del contenido de cliente (en 1)', (done) => {
      chai.request(app)
      .post('/api/tableros/prospectos/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id":1,
        "idCliente":1,
        "tipo":"persona",
        "empresa":"",
        "ruc":null,
        "genero":"H",
        "nombres":"Juanito",
        "apellidos":"Perez",
        "correo": [],
        "telefono": [],
        "titulo":"Juanito Perez",
        "prioridad":5,
        "prioridadColor":"yellow",
        "prioridadColorText":"black",
        "tiempoSinContacto":"0 horas sin contacto",
        "tiempoSinContactoNumber":null,
        "fechaContacto":null,
        "porcentajeCierre":15,
        "porcentajeColor":"#66fe00",
        "idEstadoEmbudoVenta":1,
        "estadoFinalizacion":"pendiente",
        "interacciones":{
          "whatsapp": 0,
          "telefono": 0,
          "correo": 0
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.cliente.should.be.a('array')
        res.body.cliente[0].should.be.eql(1)
        res.body.prospecto[0].should.be.eql(0)
        done()
      })
    })
  })

  describe('/GET api/tableros/prospectos/editar con data valida de empresa', () => {
    it('debería responder con la actualizacion del contenido de cliente (en 1)', (done) => {
      chai.request(app)
      .post('/api/tableros/prospectos/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id":2,
        "idCliente":2,
        "tipo":"empresa",
        "empresa":"Inteligentes SAC",
        "ruc":11516547,
        "titulo":"Juanito Perez",
        "correo": [],
        "telefono": [],
        "prioridad":3,
        "prioridadColor":"yellow",
        "prioridadColorText":"black",
        "tiempoSinContacto":"0 horas sin contacto",
        "tiempoSinContactoNumber":null,
        "fechaContacto":null,
        "porcentajeCierre":78,
        "porcentajeColor":"#66fe00",
        "idEstadoEmbudoVenta":4,
        "estadoFinalizacion":"pendiente",
        "interacciones":{
          "whatsapp": 0,
          "telefono": 0,
          "correo": 0
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.cliente.should.be.a('array')
        res.body.cliente[0].should.be.eql(1)
        res.body.prospecto[0].should.be.eql(0)
        done()
      })
    })
  })

  describe('/GET api/tableros/prospectos/editar con data valida de prospecto', () => {
    it('debería responder con el la actualizacion del contenido de prospecto (en 1)', (done) => {
      chai.request(app)
      .post('/api/tableros/prospectos/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id":2,
        "idCliente":2,
        "tipo":"empresa",
        "empresa":"Inteligentes SAC",
        "ruc":11516547,
        "titulo":"Juanito Perez",
        "correo": [],
        "telefono": [],
        "prioridad":3,
        "prioridadColor":"yellow",
        "prioridadColorText":"black",
        "tiempoSinContacto":"0 horas sin contacto",
        "tiempoSinContactoNumber":null,
        "fechaContacto":null,
        "porcentajeCierre":60,
        "porcentajeColor":"#66fe00",
        "idEstadoEmbudoVenta":4,
        "estadoFinalizacion":"pendiente",
        "interacciones":{
          "whatsapp": 0,
          "telefono": 0,
          "correo": 0
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.prospecto.should.be.a('array')
        res.body.prospecto[0].should.be.eql(1)
        res.body.cliente[0].should.be.eql(0)
        done()
      })
    })
  })

  describe('/GET api/tableros/prospectos/editar con data fechaContacto de prospecto en string vacio', () => {
    it('debería responder con la no actualizacion del contenido de prospecto (en 0)', (done) => {
      chai.request(app)
      .post('/api/tableros/prospectos/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id":2,
        "idCliente":2,
        "tipo":"empresa",
        "empresa":"Inteligentes SAC",
        "ruc":11516547,
        "titulo":"Juanito Perez",
        "correo": [],
        "telefono": [],
        "prioridad":3,
        "prioridadColor":"yellow",
        "prioridadColorText":"black",
        "tiempoSinContacto":"0 horas sin contacto",
        "tiempoSinContactoNumber":null,
        "fechaContacto":'',
        "porcentajeCierre":60,
        "porcentajeColor":"#66fe00",
        "idEstadoEmbudoVenta":4,
        "estadoFinalizacion":"pendiente",
        "interacciones":{
          "whatsapp": 0,
          "telefono": 0,
          "correo": 0
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.prospecto.should.be.a('array')
        res.body.prospecto[0].should.be.eql(0)
        res.body.cliente[0].should.be.eql(0)
        done()
      })
    })
  })

  describe('/GET api/tableros/prospectos/editar con data fechaContacto de prospecto valida', () => {
    it('debería responder con la actualizacion del contenido de prospecto (en 1)', (done) => {
      chai.request(app)
      .post('/api/tableros/prospectos/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id":2,
        "idCliente":2,
        "tipo":"empresa",
        "empresa":"Inteligentes SAC",
        "ruc":11516547,
        "titulo":"Juanito Perez",
        "correo": [],
        "telefono": [],
        "prioridad":3,
        "prioridadColor":"yellow",
        "prioridadColorText":"black",
        "tiempoSinContacto":"0 horas sin contacto",
        "tiempoSinContactoNumber":null,
        "fechaContacto":'2020-02-17T01:15:23',
        "porcentajeCierre":60,
        "porcentajeColor":"#66fe00",
        "idEstadoEmbudoVenta":4,
        "estadoFinalizacion":"pendiente",
        "interacciones":{
          "whatsapp": 0,
          "telefono": 0,
          "correo": 0
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.prospecto.should.be.a('array')
        res.body.prospecto[0].should.be.eql(1)
        res.body.cliente[0].should.be.eql(0)
        done()
      })
    })
  })

  describe('/GET api/tableros/prospectos/editar con data fechaContacto de prospecto mayor a la fecha actual', () => {
    let dateActualMasUno:any;
    let dateActual = new Date();
    dateActualMasUno = dateActual.getTime() + 54545454;

    it('debería responder con la no actualizacion del contenido de prospecto (en 0)', (done) => {
      chai.request(app)
      .post('/api/tableros/prospectos/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id":2,
        "idCliente":2,
        "tipo":"empresa",
        "empresa":"Inteligentes SAC",
        "ruc":11516547,
        "titulo":"Juanito Perez",
        "correo": [],
        "telefono": [],
        "prioridad":3,
        "prioridadColor":"yellow",
        "prioridadColorText":"black",
        "tiempoSinContacto":"0 horas sin contacto",
        "tiempoSinContactoNumber":null,
        "fechaContacto":new Date(dateActualMasUno),
        "porcentajeCierre":60,
        "porcentajeColor":"#66fe00",
        "idEstadoEmbudoVenta":4,
        "estadoFinalizacion":"pendiente",
        "interacciones":{
          "whatsapp": 0,
          "telefono": 0,
          "correo": 0
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.prospecto.should.be.a('array')
        res.body.prospecto[0].should.be.eql(0)
        res.body.cliente[0].should.be.eql(0)
        done()
      })
    })
  })

  describe('/GET api/tableros/prospectos/editar con data porcentajeCierre vacío', () => {
    it('debería responder con la actualizacion del contenido de prospecto (en 1)', (done) => {
      chai.request(app)
      .post('/api/tableros/prospectos/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id":2,
        "idCliente":2,
        "tipo":"empresa",
        "empresa":"Inteligentes SAC",
        "ruc":11516547,
        "titulo":"Juanito Perez",
        "correo": [],
        "telefono": [],
        "prioridad":3,
        "prioridadColor":"yellow",
        "prioridadColorText":"black",
        "tiempoSinContacto":"0 horas sin contacto",
        "tiempoSinContactoNumber":null,
        "fechaContacto":'2020-02-17T01:15:23',
        "porcentajeColor":"#66fe00",
        "idEstadoEmbudoVenta":4,
        "estadoFinalizacion":"pendiente",
        "interacciones":{
          "whatsapp": 0,
          "telefono": 0,
          "correo": 0
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.prospecto.should.be.a('array')
        res.body.prospecto[0].should.be.eql(1)
        res.body.cliente[0].should.be.eql(0)
        done()
      })
    })
  })

  describe('/GET api/tableros/prospectos/editar con data de cliente persona para un cliente empresa sin modificarlo', () => {
    it('debería responder con la no actualizacion del contenido de cliente empresa (en 0)', (done) => {
      chai.request(app)
      .post('/api/tableros/prospectos/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id":2,
        "idCliente":2,
        "tipo":"empresa",
        "nombres":"Juanito",
        "apellidos":"Perez",
        "empresa":"Inteligentes SAC",
        "ruc":11516547,
        "titulo":"Juanito Perez",
        "correo": [],
        "telefono": [],
        "prioridad":3,
        "prioridadColor":"yellow",
        "prioridadColorText":"black",
        "tiempoSinContacto":"0 horas sin contacto",
        "tiempoSinContactoNumber":null,
        "fechaContacto":'2020-02-17T01:15:23',
        "porcentajeColor":"#66fe00",
        "idEstadoEmbudoVenta":4,
        "estadoFinalizacion":"pendiente",
        "interacciones":{
          "whatsapp": 0,
          "telefono": 0,
          "correo": 0
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.prospecto.should.be.a('array')
        res.body.prospecto[0].should.be.eql(0)
        res.body.cliente[0].should.be.eql(0)
        done()
      })
    })
  })

  describe('/GET api/tableros/prospectos/editar con data de cliente persona para un cliente empresa modificandola', () => {
    it('debería responder con la actualizacion del contenido de cliente empresa (en 1)', (done) => {
      chai.request(app)
      .post('/api/tableros/prospectos/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id":2,
        "idCliente":2,
        "tipo":"empresa",
        "nombres":"Juanito",
        "apellidos":"Perez",
        "empresa":"Inteligentes SAC",
        "ruc":10000016547,
        "titulo":"Juanito Perez",
        "correo": [],
        "telefono": [],
        "prioridad":3,
        "prioridadColor":"yellow",
        "prioridadColorText":"black",
        "tiempoSinContacto":"0 horas sin contacto",
        "tiempoSinContactoNumber":null,
        "fechaContacto":'2020-02-17T01:15:23',
        "porcentajeColor":"#66fe00",
        "idEstadoEmbudoVenta":4,
        "estadoFinalizacion":"pendiente",
        "interacciones":{
          "whatsapp": 0,
          "telefono": 0,
          "correo": 0
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.prospecto.should.be.a('array')
        res.body.prospecto[0].should.be.eql(0)
        res.body.cliente[0].should.be.eql(1)
        res.body.content.id.should.be.eql(2)
        res.body.content.idCliente.should.be.eql(2)
        res.body.content.titulo.should.be.eql('Inteligentes SAC')
        res.body.content.tiempoSinContactoNumber.should.not.be.eql(null)
        done()
      })
    })
  })
})
