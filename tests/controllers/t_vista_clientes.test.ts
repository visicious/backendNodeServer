import { contarClientes } from '../../controllers/t_vista_clientes';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import 'mocha';
import { test_t_clientes, test_t_usuarios_x_clientes } from '../../config/sequelize';



chai.should();


describe('Funciones independientes del controlador de Vista Clientes', () => {
  before(async () => {
    test_t_clientes.destroy({
      where: {},
      truncate: true
    });

    test_t_usuarios_x_clientes.destroy({
      where: {},
      truncate: true
    });

    let persona:any = {
      intencionCompra: 0,
      estado: 'nuevo',
      observacion: '',
      horaFechaCreacion: new Date(),
      nombres: "Alfonso",
      apellidos: "Santisteban",
      genero: "H",
    }

    // @ts-ignore
    let testCliente = await test_t_clientes.create(persona);
    // @ts-ignore
    let testClienteXUsuario = await test_t_usuarios_x_clientes.create({
      idUsuario: 1,
      idCliente: testCliente.id
    });
    if (testCliente) {
      console.log('Entorno preparado para las pruebas');
    } else {
      console.error('Error agregando plan previo a la configuracion');
    }
  });

  describe('Funcion: contarClientes(idUsuario=1) con el retorno de 1', () => {
    let cantidadClientes:any;

    before(async () => {
      cantidadClientes = await contarClientes(1);
    });

    after(() => {
      cantidadClientes = null;
    });

    it('debería retornar vacío', (done) => {
      cantidadClientes.should.be.equal(1);
      done();
    })
  })
})
