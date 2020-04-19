import app from '../../index';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import 'mocha';
import { test_t_empresas } from '../../config/sequelize';


chai.should();
chai.use(chaiHttp);


describe('Rutas de Empresa', () => {

  before(() => {
    test_t_empresas.destroy({
      where: {},
      truncate: true
    });
  });

  describe('/POST api/empresas/agregar (1 elemento en la base de datos)', () => {
    it('debería agregar una empresa por POST', (done) => {
      chai.request(app)
      .post('/api/empresas/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "nombre": "Ninguna",
        "cantidadTrabajadores": "1-10"
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.nombre.should.be.eql('Ninguna')
        res.body.content.cantidadTrabajadores.should.be.eql('1-10')
        done()
      })
    })
  })

  describe('/POST api/empresas/agregar (1 elemento con nombre repetido)', () => {
    it('debería lanzar un error de nombre repetido por POST', (done) => {
      chai.request(app)
      .post('/api/empresas/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "nombre": "Ninguna",
        "cantidadTrabajadores": "50-100"
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
})
