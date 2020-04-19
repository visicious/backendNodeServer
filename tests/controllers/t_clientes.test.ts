import { esCliente } from '../../controllers/t_clientes';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import 'mocha';


chai.should();


describe('Funciones independientes del controlador de Clientes', () => {
  describe('Funcion: esCliente(req.body) con data valida de tipo persona', () => {
    let cliente = {
      "nombres": "Andres Alejandro",
      "apellidos": "Juarez Jimenez",
      "genero": "H",
      "ruc": 11051165351,
      "direccion": "Urb Manzana Roja, Calle Tobaco 13",
      "web": "and.all.ju.jim@hotmail.com",
    };

    it('debería retornar verdadero a pesar de tener datos adicionales', (done) => {
      const siEsCliente = esCliente(cliente);
      siEsCliente.should.be.equal(true);
      done();
    })
  })

  describe('Funcion: esCliente(req.body) con data valida de tipo empresa', () => {
    let cliente = {
      "empresa": "Probando EIRL",
      "ruc": 11051165351
    };

    it('debería retornar verdadero', (done) => {
      const siEsCliente = esCliente(cliente);
      siEsCliente.should.be.equal(true);
      done();
    })
  })

  describe('Funcion: esCliente(req.body) con data invalida', () => {
    let cliente = {
      "nombres": "Andres Alejandro",
      "apellidos": "Juarez Jimenez"
    };

    it('debería retornar falso', (done) => {
      const siEsCliente = esCliente(cliente);
      siEsCliente.should.be.equal(false);
      done();
    })
  })
})
