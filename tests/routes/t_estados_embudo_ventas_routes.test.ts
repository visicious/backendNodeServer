import app from '../../index';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import 'mocha';
import { test_t_estados_embudo_ventas, test_t_usuarios } from '../../config/sequelize';


chai.should();
chai.use(chaiHttp);


describe('Rutas de Estados de Embudo de Ventas', () => {
  let testToken:any;

  before(async () => {
    test_t_usuarios.destroy({
      where: {},
      truncate: true
    });
    test_t_estados_embudo_ventas.destroy({
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
    if (usuario) {
      testToken = usuario.generateJWT();
      console.log(testToken)
      console.log('Entorno preparado para las pruebas') 
    } else {
      console.error('Error agregando plan previo a la configuracion') 
    }
  });

  describe('/GET api/estados_embudo/obtener cuando tiene mas de un elemento', () => {
    it('debería retornar un arreglo vacío por GET', (done) => {
      chai.request(app)
      .get('/api/estados_embudo/obtener')
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

  describe('/POST api/estados_embudo/agregar (0 elementos en la base de datos)', () => {
    it('debería agregar un estado por POST', (done) => {
      chai.request(app)
      .post('/api/estados_embudo/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "nombre": "Prospectos",
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.should.be.a('object')
        res.body.content.nombre.should.be.eql('Prospectos')
        res.body.content.orden.should.be.eql(0)
        res.body.content.idUsuario.should.be.eql(1)
        done()
      })
    })
  })

  describe('/POST api/estados_embudo/agregar (1 elemento en la base de datos)', () => {
    it('debería ingresar con el orden en 1', (done) => {
      chai.request(app)
      .post('/api/estados_embudo/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "nombre": "Contactados",
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.should.be.a('object')
        res.body.content.nombre.should.be.eql('Contactados')
        res.body.content.orden.should.be.eql(1)
        res.body.content.idUsuario.should.be.eql(1)
        done()
      })
    })
  })

  describe('/POST api/estados_embudo/agregar intentando agregar elemento con jwt errado', () => {
    it('debería lanzar error de autenticación', (done) => {
      chai.request(app)
      .post('/api/estados_embudo/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "nombre": "Prospectos",
        "orden": 0,
        "token": 'lkakljdasjlkdsakjlei298423789842uc'
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

  describe('/GET api/estados_embudo/obtener cuando tiene mas de un elemento', () => {
    it('debería obtener todos los estados(2) por GET', (done) => {
      chai.request(app)
      .get('/api/estados_embudo/obtener')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.content.should.be.a('array')
        res.body.content.length.should.be.eql(2)
        res.body.content[0].nombre.should.be.eql('Prospectos')
        res.body.content[1].nombre.should.be.eql('Contactados')
        done()
      })
    })
  })
})
