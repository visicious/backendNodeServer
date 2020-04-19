import app from '../../index';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import 'mocha';
import { test_t_clientes, test_t_usuarios, test_t_estados_embudo_ventas, test_t_prospectos } from '../../config/sequelize';


chai.should();
chai.use(chaiHttp);


describe('Rutas de Vista Cliente', () => {
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
    let usuario = test_t_usuarios.build(dataUsuario);
    // @ts-ignore
    usuario.horaFechaCreacion = new Date();
    // @ts-ignore
    usuario.setSaltAndHash(dataUsuario.password);
    // @ts-ignore

    let persona:any = {
      intencionCompra: 0,
      estado: 'prospecto',
      observacion: '',
      horaFechaCreacion: new Date(),
      nombres: "Alfonso",
      apellidos: "Santisteban",
      genero: "H",
    }

    let prospectoPersona:any = {
      idCliente: 1,
      porcentajeCierre: 0.15,
      prioridad: 5,
      horaFechaCreacion: new Date(),
      estadoFinalizacion: 'pendiente',
      idEstadoEmbudoVenta: 1
    }

    // @ts-ignore
    let testUsuario = await usuario.save();
    // @ts-ignore
    let testCliente = await test_t_clientes.create(persona);
    // @ts-ignore
    let testProspecto = await test_t_prospectos.create(prospectoPersona);
    if (testUsuario) {
      testToken = testUsuario.generateJWT();
      console.log(testToken)
      console.log('Entorno preparado para las pruebas')
      
    } else {
      console.error('Error agregando plan previo a la configuracion') 
    }
  });

  describe('/POST api/vista_clientes/obtener cuando esta vacío', () => {
    it('debería retornar un objeto cliente por POST', (done) => {
      chai.request(app)
      .post('/api/vista_clientes/obtener')
      .set('Content-Type','application/json')
      .send({
        'query': {
          'filters': [],
          'orderDirection': '',
          'page': 0,
          'pageSize': 5,
          'search': '',
          'totalCount': 0
        },
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        done()
      })
    })
  })
})
