import { esProspecto } from '../../controllers/t_prospectos';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import 'mocha';


chai.should();


describe('Funciones independientes del controlador de Prospectos', () => {
  describe('Funcion: esProspecto(req.body) con data valida', () => {
    let prospecto = {
      "porcentajeCierre": 0.78,
      "prioridad": 3,
      "idEstadoEmbudoVenta": 4,
    };

    it('debería retornar verdadero a pesar de tener datos adicionales', (done) => {
      const siEsProspecto = esProspecto(prospecto);
      siEsProspecto.should.be.equal(true);
      done();
    })
  })

  describe('Funcion: esProspecto(req.body) con data invalida', () => {
    let prospecto = {
      "porcentajeCierre": 0.78,
      "prioridad": 3,
    };

    it('debería retornar falso', (done) => {
      const siEsProspecto = esProspecto(prospecto);
      siEsProspecto.should.be.equal(false);
      done();
    })
  })
})
