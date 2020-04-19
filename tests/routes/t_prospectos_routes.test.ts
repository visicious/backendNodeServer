import app from '../../index';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import 'mocha';
import { test_t_prospectos, test_t_usuarios, test_t_clientes } from '../../config/sequelize';


chai.should();
chai.use(chaiHttp);


describe('Rutas de Prospectos', () => {

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

    let dataUsuario:any = {
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

    let persona:any = {
      intencionCompra: 0,
      estado: 'prospecto',
      observacion: '',
      horaFechaCreacion: new Date(),
      nombres: "Alfonso",
      apellidos: "Santisteban",
      genero: "H",
    }

    // @ts-ignore
    let testUsuario = test_t_usuarios.build(dataUsuario);
    // @ts-ignore
    testUsuario.horaFechaCreacion = new Date();
    // @ts-ignore
    testUsuario.setSaltAndHash(dataUsuario.password);
    // @ts-ignore
    let usuario = await testUsuario.save()
    // @ts-ignore
    let testCliente = await test_t_clientes.create(persona);
    if (usuario) {
      testToken = usuario.generateJWT();
      console.log(testToken)
      console.log('Entorno preparado para las pruebas')
    } else {
      console.error('Error agregando plan previo a la configuracion')
    }
  });

  describe('/GET api/prospectos/obtener (0 elementos en la base de datos)', () => {
    it('debería devolve un arreglo vacío', (done) => {
      chai.request(app)
      .get('/api/prospectos/obtener')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.content.should.be.a('array')
        res.body.content.length.should.be.eql(0)
        done()
      })
    })
  })

  describe('/POST api/prospectos/agregar (1 elemento en la base de datos)', () => {
    it('debería agregar unicamente un prospecto por POST', (done) => {
      chai.request(app)
      .post('/api/prospectos/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "idCliente": 1,
        "porcentajeCierre": 15,
        "prioridad": 5,
        "idEstadoEmbudoVenta": 1,
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.id.should.be.eql(1)
        res.body.content.idCliente.should.be.eql(1)
        res.body.content.porcentajeCierre.should.be.eql(0.15)
        res.body.content.prioridad.should.be.eql(5)
        res.body.content.idEstadoEmbudoVenta.should.be.eql(1)
        res.body.content.horaFechaCreacion.should.be.a('string')
        res.body.content.estadoFinalizacion.should.be.eql('pendiente')
        done()
      })
    })
  })

  describe('/POST api/prospectos/agregar (2 elementos en la base de datos)', () => {
    it('debería agregar un prospecto y un cliente tipo persona por POST', (done) => {
      chai.request(app)
      .post('/api/prospectos/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "prospecto": {
          "porcentajeCierre": 15,
          "prioridad": 5,
          "idEstadoEmbudoVenta": 1,
        },
        "cliente": {
          "nombres": "Andres Alejandro",
          "apellidos": "Juarez Jimenez",
          "genero": "H",
          "direccion": "Urb Manzana Roja, Calle Tobaco 13",
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.prospecto.message.should.be.eql('OK')
        res.body.prospecto.content.idCliente.should.be.eql(res.body.cliente.content.id)
        res.body.prospecto.content.porcentajeCierre.should.be.eql(0.15)
        res.body.prospecto.content.prioridad.should.be.eql(5)
        res.body.prospecto.content.idEstadoEmbudoVenta.should.be.eql(1)
        res.body.prospecto.content.horaFechaCreacion.should.be.a('string')
        res.body.prospecto.content.estadoFinalizacion.should.be.eql('pendiente')
        res.body.cliente.message.should.be.eql('OK')
        res.body.cliente.content.nombres.should.be.eql("Andres Alejandro")
        res.body.cliente.content.apellidos.should.be.eql('Juarez Jimenez')
        res.body.cliente.content.genero.should.be.eql('H')
        res.body.cliente.content.direccion.should.be.eql('Urb Manzana Roja, Calle Tobaco 13')
        res.body.cliente.content.empresa.should.be.eql('')
        res.body.cliente.content.should.not.include.keys("web",'ruc')
        done()
      })
    })
  })

  describe('/POST api/prospectos/agregar (3 elementos en la base de datos)', () => {
    it('debería agregar un prospecto y un cliente tipo empresa por POST', (done) => {
      chai.request(app)
      .post('/api/prospectos/agregar')
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

  describe('/POST api/prospectos/agregar (4 elementos en la base de datos)', () => {
    it('debería agregar un prospecto y un cliente tipo empresa por POST, con porcentaje de cierre en 0', (done) => {
      chai.request(app)
      .post('/api/prospectos/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "prospecto": {
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
        res.body.prospecto.content.porcentajeCierre.should.be.eql(0)
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

  describe('/POST api/prospectos/agregar (4 elementos en la base de datos)', () => {
    it('debería dar error por datos incorrectos', (done) => {
      chai.request(app)
      .post('/api/prospectos/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "prospecto": {
          "prioridad": 3,
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
        res.should.have.status(400)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('ERROR')
        res.body.content.should.be.eql('Error al crear el prospecto: Datos insuficientes')
        res.body.excerpt.should.be.a('array')
        done()
      })
    })
  })

  describe('/GET api/prospectos/obtener (4 elementos en la base de datos)', () => {
    it('debería obtener todos los prospectos de la base de datos', (done) => {
      chai.request(app)
      .get('/api/prospectos/obtener')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.content.should.be.a('array')
        res.body.content.length.should.be.eql(4)
        done()
      })
    })
  })

  describe('/POST api/prospectos/cambiar_estado al elemento con id 2', () => {
    it('debería actualizar de manera correcta idEstadoEmbudoVenta del prospecto', (done) => {
      chai.request(app)
      .post('/api/prospectos/cambiar_estado')
      .set('Content-Type', 'application/json')
      .send({
        "id": 2,
        "idColumna": 5,
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.should.be.a('array')
        res.body.content[0].should.be.eql(1)
        done()
      })
    })
  })

  describe('/POST api/prospectos/cierre al elemento con id 2', () => {
    it('debería actualizar de manera correcta estadoFinalizacion del prospecto', (done) => {
      chai.request(app)
      .post('/api/prospectos/cierre')
      .set('Content-Type', 'application/json')
      .send({
        "id": 2,
        "estado": "eliminado",
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.should.be.a('array')
        res.body.content[0].should.be.eql(1)
        res.body.cliente[0].should.be.eql(1)
        res.body.vinculo[0].should.be.eql(1)
        done()
      })
    })
  })
})