import app from '../../index';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import 'mocha';
import { test_t_planes } from '../../config/sequelize';


chai.should();
chai.use(chaiHttp);


describe('Rutas de Plan', () => {

  before(() => {
    test_t_planes.destroy({
      where: {},
      truncate: true
    });
  });

  describe('/GET api/planes/obtener cuando esta vacío', () => {
    it('debería retornar un arreglo vacio por GET', (done) => {
      chai.request(app)
      .get('/api/planes/obtener')
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

  describe('/GET api/planes/obtener/1 (con el id=1) cuando no existe ese elemento', () => {
    it('debería salir error', (done) => {
      chai.request(app)
      .get('/api/planes/obtener/1')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('ERROR')
        done()
      })
    })
  })

  describe('/POST api/planes/agregar (1 elemento en la base de datos)', () => {
    it('debería agregar un plan por POST', (done) => {
      chai.request(app)
      .post('/api/planes/agregar')
      .set('Content-Type', 'application/json')
      .send({
        'nombre': 'Avanzado',
        'costo': 'S/. 210,62',
        'beneficios': 'Bueno, por este plan estamos a su total disposicion. Cambios ilimitados, soporte total y uso de sarcasmo al mínimo. Sabemos que en pleno siglo XXI no debería haber esclavitud, pero lo que esta contratando se le parece. A sus ordenes amos!'
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.nombre.should.be.eql('Avanzado')
        res.body.content.costo.should.be.eql('S/. 210,62')
        res.body.content.beneficios.should.be.eql('Bueno, por este plan estamos a su total disposicion. Cambios ilimitados, soporte total y uso de sarcasmo al mínimo. Sabemos que en pleno siglo XXI no debería haber esclavitud, pero lo que esta contratando se le parece. A sus ordenes amos!')
        done()
      })
    })
  })

  describe('/GET api/planes/obtener/1 (con el id=1)', () => {
    it('debería obtener el plan "Avanzado" por GET', (done) => {
      chai.request(app)
      .get('/api/planes/obtener/1')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.content.nombre.should.be.eql('Avanzado')
        done()
      })
    })
  })

  describe('/GET api/planes/obtener cuando tiene un solo elemento', () => {
    it('debería obtener todos los planes(1) por GET', (done) => {
      chai.request(app)
      .get('/api/planes/obtener')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.content.should.be.a('array')
        res.body.content.length.should.be.eql(1)
        res.body.content[0].nombre.should.be.eql('Avanzado')
        done()
      })
    })
  })

  describe('/POST api/planes/agregar (2 elementos en la base de datos)', () => {
    it('debería agregar el plan "Basico" por POST', (done) => {
      chai.request(app)
      .post('/api/planes/agregar')
      .set('Content-Type', 'application/json')
      .send({
        'nombre': 'Basico',
        'costo': 'S/. 99,51',
        'beneficios': 'Muchas horas de mantenimiento, de cambios aleatorios de codigo, de posibilidades infinitas de llamadas y de funcionamientos que no estamos esperando que necesiten pero que van a pedir porque ya los conocemos....'
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.nombre.should.be.eql('Basico')
        done()
      })
    })
  })

  describe('/GET api/planes/obtener cuando tiene mas de un elemento', () => {
    it('debería obtener todos los planes(2) por GET', (done) => {
      chai.request(app)
      .get('/api/planes/obtener')
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.content.should.be.a('array')
        res.body.content.length.should.be.eql(2)
        res.body.content[0].nombre.should.be.eql('Avanzado')
        res.body.content[1].nombre.should.be.eql('Basico')
        done()
      })
    })
  })
})
