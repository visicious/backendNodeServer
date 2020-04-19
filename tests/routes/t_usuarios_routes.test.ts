import app from '../../index';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import 'mocha';
import { test_t_usuarios, test_t_planes } from '../../config/sequelize';


chai.should();
chai.use(chaiHttp);


describe('Rutas de Usuario', () => {

  before(() => {
    test_t_usuarios.destroy({
      where: {},
      truncate: true
    });
    // @ts-ignore
    test_t_planes.create({
      nombre: 'Avanzado',
      costo: 'S/. 210,62',
      beneficios: 'Bueno, por este plan estamos a su total disposicion. Cambios ilimitados, soporte total y uso de sarcasmo al mínimo. Sabemos que en pleno siglo XXI no debería haber esclavitud, pero lo que esta contratando se le parece. A sus ordenes amos!'
    }).then((planes: any) => {
      if (planes) {
        console.log('Entorno preparado para las pruebas') 
      } else {
        console.error('Error agregando plan previo a la configuracion') 
      }
    })
  });

  describe('/POST api/usuarios/ingreso_nuevo (1 elemento usuario y 1 elemento empresa)', () => {
    it('debería agregar un usuario y una empresa nuevos por POST', (done) => {
      chai.request(app)
      .post('/api/usuarios/ingreso_nuevo')
      .set('Content-Type', 'application/json')
      .send({
          "usuario": {
            "nombres": "Joel",
            "apellidos": "Valdez",
            "usuario": "jo3lv4ld3z",
            "password": "123456789",
            "correo": "jean1993p@hotmail.com",
            "celular": 959356464,
            "imagen": "fotos_usuario/foto.jpg",
            "estaActivo": 1,
            "rol": "administrador",
            "opcionVentanaMail": 7,
            "nivelesPrioridad": 5,
            "idPlan": 1
          },
          "empresa": {
            "nombre": "Kopac Q'ori",
            "cantidadTrabajadores": "100-500"
          },
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.empresa.message.should.be.eql('OK')
        res.body.empresa.content.nombre.should.be.eql("Kopac Q'ori")
        res.body.empresa.content.cantidadTrabajadores.should.be.eql('100-500')
        res.body.usuario.message.should.be.eql('OK')
        res.body.usuario.content.nombres.should.be.eql('Joel')
        res.body.usuario.content.apellidos.should.be.eql('Valdez')
        res.body.usuario.content.usuario.should.be.eql('jo3lv4ld3z')
        res.body.usuario.content.correo.should.be.eql('jean1993p@hotmail.com')
        done()
      })
    })
  })

  describe('/POST api/usuarios/agregar (1 elemento en la base de datos)', () => {
    it('debería agregar una usuario por POST', (done) => {
      chai.request(app)
      .post('/api/usuarios/agregar')
      .set('Content-Type', 'application/json')
      .send({
          "nombres": "Joel",
          "apellidos": "Valdez",
          "usuario": "jo3lv4ld3z",
          "password": "123456789",
          "correo": "asaas@hotmail.com",
          "celular": 959356464,
          "imagen": "fotos_usuario/foto.jpg",
          "estaActivo": 1,
          "rol": "administrador",
          "opcionVentanaMail": 7,
          "nivelesPrioridad": 5,
          "idPlan": 1,
          "idEmpresa": 1
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.nombres.should.be.eql('Joel')
        res.body.content.apellidos.should.be.eql('Valdez')
        res.body.content.usuario.should.be.eql('jo3lv4ld3z')
        res.body.content.correo.should.be.eql('asaas@hotmail.com')
        done()
      })
    })
  })

  describe('/POST api/usuarios/agregar (1 elemento con correo repetido)', () => {
    it('debería lanzar un error de correo repetido por POST', (done) => {
      chai.request(app)
      .post('/api/usuarios/agregar')
      .set('Content-Type', 'application/json')
      .send({
          "nombres": "Joel",
          "apellidos": "Valdez",
          "usuario": "jo3lv4ld3z",
          "password": "123456789",
          "correo": "asaas@hotmail.com",
          "celular": 959356464,
          "imagen": "fotos_usuario/foto.jpg",
          "estaActivo": 1,
          "rol": "administrador",
          "opcionVentanaMail": 7,
          "nivelesPrioridad": 5,
          "idPlan": 1,
          "idEmpresa": 1
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('ERROR')
        done()
      })
    })
  })

  describe('/POST api/usuarios/ingreso_nuevo (usuario con correo repetido)', () => {
    it('debería lanzar un error de correo repetido por POST', (done) => {
      chai.request(app)
      .post('/api/usuarios/ingreso_nuevo')
      .set('Content-Type', 'application/json')
      .send({
          "usuario": {
            "nombres": "Joel",
            "apellidos": "Valdez",
            "usuario": "jo3lv4ld3z",
            "password": "123456789",
            "correo": "jean1993p@hotmail.com",
            "celular": 959356464,
            "imagen": "fotos_usuario/foto.jpg",
            "estaActivo": 1,
            "rol": "administrador",
            "opcionVentanaMail": 7,
            "nivelesPrioridad": 5,
            "idPlan": 1
          },
          "empresa": {
            "nombre": "Ninguna",
            "cantidadTrabajadores": "1-10"
          },
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('ERROR')
        done()
      })
    })
  })

  describe('/POST api/usuarios/ingreso_nuevo (empresa con nombre repetido)', () => {
    it('debería lanzar un error de nombre repetido por POST', (done) => {
      chai.request(app)
      .post('/api/usuarios/ingreso_nuevo')
      .set('Content-Type', 'application/json')
      .send({
          "usuario": {
            "nombres": "Joel",
            "apellidos": "Valdez",
            "usuario": "jo3lv4ld3z",
            "password": "123456789",
            "correo": "automatom@hotmail.com",
            "celular": 959356464,
            "imagen": "fotos_usuario/foto.jpg",
            "estaActivo": 1,
            "rol": "administrador",
            "opcionVentanaMail": 7,
            "nivelesPrioridad": 5,
            "idPlan": 1
          },
          "empresa": {
            "nombre": "Kopac Q'ori",
            "cantidadTrabajadores": "1-10"
          },
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('ERROR')
        done()
      })
    })
  })

  describe('/POST api/usuarios/login (2 elementos en la bd)', () => {
    it('debería dar un login correcto', (done) => {
      chai.request(app)
      .post('/api/usuarios/login')
      .set('Content-Type', 'application/json')
      .send({
          "password": "123456789",
          "usuario": "asaas@hotmail.com"
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.includes.keys(["message", "content", "token"]);
        res.body.message.should.be.eql('OK')
        res.body.content.should.be.eql('Ingreso correcto')
        done()
      })
    })
  
    it('debería dar un login incorrecto', (done) => {
      chai.request(app)
      .post('/api/usuarios/login')
      .set('Content-Type', 'application/json')
      .send({
          "password": "1236789",
          "usuario": "asaas@hotmail.com"
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.should.includes.keys(["message", "content"]);
        res.body.should.not.includes.keys(["token"]);
        res.body.message.should.be.eql('ERROR')
        res.body.content.should.be.eql('Correo o contraseña incorrectos. Intente nuevamente')
        done()
      })
    })
  })

  describe('/POST api/usuarios/verificar_usuario con un nombre de usuario nuevo', () => {
    it('debería responder que el usuario se puede utilizar', (done) => {
      chai.request(app)
      .post('/api/usuarios/verificar_usuario')
      .set('Content-Type', 'application/json')
      .send({
          "usuario": "visicious",
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.should.be.eql('Nombre de usuario disponible')
        done()
      })
    })
  })

  describe('/POST api/usuarios/verificar_usuario con un nombre de usuario existente', () => {
    it('debería responder que el usuario no se puede utilizar', (done) => {
      chai.request(app)
      .post('/api/usuarios/verificar_usuario')
      .set('Content-Type', 'application/json')
      .send({
          "usuario": "jo3lv4ld3z",
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('ERROR')
        res.body.content.should.be.eql('Nombre de usuario no disponible')
        done()
      })
    })
  })
})
