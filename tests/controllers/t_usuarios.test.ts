import { existeUsuario } from '../../controllers/t_usuarios';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import 'mocha';


chai.should();


describe('Funciones independientes del controlador de Usuario', () => {
  describe('Funcion: existeUsuario(id) con un id inválido', () => {
    let usuarioInexistente:any;

    before(async () => {
      usuarioInexistente = await existeUsuario(100);
    });

    after(() => {
      usuarioInexistente = null;
    });

    it('debería retornar vacío', (done) => {
      usuarioInexistente.should.be.equal(false);
      done();
    })
  })
})
