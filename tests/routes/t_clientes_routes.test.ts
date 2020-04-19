import app from '../../index';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import 'mocha';
import { test_t_clientes, test_t_usuarios, test_t_prospectos, test_t_usuarios_x_prospectos } from '../../config/sequelize';


chai.should();
chai.use(chaiHttp);


describe('Rutas de Cliente', () => {

  let testToken:any;

  before(async () => {
    test_t_clientes.destroy({
      where: {},
      truncate: true
    });
    test_t_usuarios_x_prospectos.destroy({
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
    let testUsuario = test_t_usuarios.build(dataUsuario);
    // @ts-ignore
    testUsuario.horaFechaCreacion = new Date();
    // @ts-ignore
    testUsuario.setSaltAndHash(dataUsuario.password);
    // @ts-ignore
    let usuario = await testUsuario.save()

    // @ts-ignore
    let usuarioXProspecto = await test_t_usuarios_x_prospectos.create({
      idUsuario: 1,
      idProspecto: 1
    });

    // @ts-ignore
    let prospecto = await test_t_prospectos.create({
      idCliente: 1,
      porcentajeCierre: 0.15,
      prioridad: 5,
      horaFechaCreacion: new Date(),
      estadoFinalizacion: 'pendiente',
      idEstadoEmbudoVenta: 1
    });

    if (usuario) {
      testToken = usuario.generateJWT();
      console.log(testToken)
      console.log('Entorno preparado para las pruebas') 
    } else {
      console.error('Error agregando plan previo a la configuracion') 
    }
  });

  describe('/POST api/clientes/agregar (0 elementos en la base de datos)', () => {
    it('debería agregar un cliente tipo persona por POST y no setear valores del otro tipo', (done) => {
      chai.request(app)
      .post('/api/clientes/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "nombres": "Andres Alejandro",
        "apellidos": "Juarez Jimenez",
        "genero": "H",
        "ruc": 11051165351,
        "direccion": "Urb Manzana Roja, Calle Tobaco 13",
        "web": "and.all.ju.jim@hotmail.com",
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.nombres.should.be.eql('Andres Alejandro')
        res.body.content.apellidos.should.be.eql('Juarez Jimenez')
        res.body.content.genero.should.be.eql('H')
        res.body.content.intencionCompra.should.be.eql(0)
        res.body.content.observacion.should.be.eql('')
        res.body.content.horaFechaCreacion.should.be.a('string')
        res.body.content.direccion.should.be.eql('Urb Manzana Roja, Calle Tobaco 13')
        res.body.content.web.should.be.eql('and.all.ju.jim@hotmail.com')
        res.body.content.empresa.should.be.eql('')
        res.body.content.should.not.include.keys('ruc')
        done()
      })
    })
  })

  describe('/POST api/clientes/agregar (1 elemento en la base de datos)', () => {
    it('debería agregar un cliente tipo empresa por POST y no setear valores del otro tipo', (done) => {
      chai.request(app)
      .post('/api/clientes/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "empresa": "Inteligentes SAC",
        "genero": "H",
        "direccion": "Urb Manzana Roja, Calle Tobaco 13",
        "web": "and.all.ju.jim@hotmail.com",
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.intencionCompra.should.be.eql(0)
        res.body.content.empresa.should.be.eql('Inteligentes SAC')
        res.body.content.observacion.should.be.eql('')
        res.body.content.horaFechaCreacion.should.be.a('string')
        res.body.content.direccion.should.be.eql('Urb Manzana Roja, Calle Tobaco 13')
        res.body.content.web.should.be.eql('and.all.ju.jim@hotmail.com')
        res.body.content.nombres.should.be.eql('')
        res.body.content.apellidos.should.be.eql('')
        res.body.content.genero.should.be.eql('')
        done()
      })
    })
  })

  describe('/GET api/clientes/obtener/1 cuando tiene un solo elemento', () => {
    it('debería obtener todos los clientes asociados al usuario 1(1)  por GET', (done) => {
      chai.request(app)
      .get('/api/clientes/obtener/1')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.content.should.be.a('array')
        res.body.content.length.should.be.eql(1)
        res.body.content[0].id.should.be.eql(1)
        res.body.content[0].ultimoProspecto.idCliente.should.be.eql(1)
        res.body.content[0].estadoCliente.should.be.eql('prospecto')
        res.body.content[0].nombres.should.be.eql('Andres Alejandro')
        res.body.content[0].apellidos.should.be.eql('Juarez Jimenez')
        res.body.content[0].genero.should.be.eql('H')
        res.body.content[0].cantidadCierres.should.be.eql(0)
        res.body.content[0].intencionCompra.should.be.eql(0)
        res.body.content[0].ultimoProspecto.should.be.a('object')
        res.body.content[0].ultimoProspecto.porcentajeCierre.should.be.eql(15)
        res.body.content[0].ultimoProspecto.prioridad.should.be.eql(5)
        done()
      })
    })
  })

  describe('/POST api/clientes/agregar (2 elementos en la base de datos)', () => {
    it('debería dar error por falta de JWT', (done) => {
      chai.request(app)
      .post('/api/clientes/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "empresa": "Inteligentes SAC",
        "genero": "H",
        "direccion": "Urb Manzana Roja, Calle Tobaco 13",
        "web": "and.all.ju.jim@hotmail.com",
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(403)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('ERROR')
        res.body.content.should.be.eql('Error de Autenticacion')
        done()
      })
    })
  })
})
