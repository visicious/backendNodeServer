import app from '../../index';
// @ts-ignore
import chai from 'chai';
// @ts-ignore
import chaiHttp = require('chai-http');
import 'mocha';
import { test_t_prospectos, test_t_usuarios, test_t_clientes, test_t_canales, test_t_interacciones } from '../../config/sequelize';


chai.should();
chai.use(chaiHttp);


describe('Rutas de Interacciones', () => {
  let testToken:any;

  before(async () => {
    test_t_interacciones.destroy({
      where: {},
      truncate: true
    });

    test_t_usuarios.destroy({
      where: {},
      truncate: true
    });

    test_t_prospectos.destroy({
      where: {},
      truncate: true
    });

    test_t_canales.destroy({
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
    // @ts-ignore
    let testCanal = await test_t_canales.create({
      nombre: 'whatsapp',
      color: '#25d366',
      logo: '/static/img/whatsapp_canal.png'
    }); 
    if (testUsuario) {
      testToken = testUsuario.generateJWT();
      console.log(testToken)
      console.log('Entorno preparado para las pruebas') 
    } else {
      console.error('Error agregando plan previo a la configuracion') 
    }
  });

  describe('/POST api/interacciones/agregar (1 elemento en la base de datos)', () => {
    it('debería agregar unicamente un prospecto por POST', (done) => {
      chai.request(app)
      .post('/api/interacciones/agregar')
      .set('Content-Type', 'application/json')
      .send({
        "idProspecto": 1,
        "canal": 'whatsapp',
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(201)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content.id.should.be.eql(1)
        res.body.content.canal.should.be.eql('whatsapp')
        res.body.content.idUsuario.should.be.eql(1)
        res.body.content.idProspecto.should.be.eql(1)
        res.body.content.comentario.should.be.eql('')
        res.body.content.estadoInteraccion.should.be.eql(0)
        res.body.content.should.not.include.keys('horaFechaFinalizacion')
        res.body.content.should.include.keys('horaFechaInicio')
        done()
      })
    })
  })

  describe('/POST api/interacciones/editar con un nuevo comentario en la interaccion 1', () => {
    it('debería editar correctamente la interaccion 1 por POST', (done) => {
      chai.request(app)
      .post('/api/interacciones/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id": 1,
        "comentario": 'Creo que estuvo bastante atinado con la recepcion de informacion',
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content[0].should.be.eql(1)
        done()
      })
    })
  })

  describe('/POST api/interacciones/editar con el mismo estado en la interaccion 1', () => {
    it('debería no editar la interaccion 1 por datos que son iguales por POST', (done) => {
      chai.request(app)
      .post('/api/interacciones/editar')
      .set('Content-Type', 'application/json')
      .send({
        "id": 1,
        "estadoInteraccion": 0,
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content[0].should.be.eql(0)
        done()
      })
    })
  })

  describe('/POST api/interacciones/eliminar para borrar logicamente la interaccion 1', () => {
    it('debería eliminar la interaccion 1 por POST', (done) => {
      chai.request(app)
      .post('/api/interacciones/eliminar')
      .set('Content-Type', 'application/json')
      .send({
        "id": 1,
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content[0].should.be.eql(1)
        done()
      })
    })
  })

  describe('/POST api/interacciones/colocar_termino para borrar logicamente la interaccion 1', () => {
    it('debería poner correctamente la fecha de termino a la interaccion 1 por POST', (done) => {
      chai.request(app)
      .post('/api/interacciones/colocar_termino')
      .set('Content-Type', 'application/json')
      .send({
        "id": 1,
        "horaFechaTermino": '2020-02-03T10:43:15',
        "token": testToken
      })
      .end((err, res) => {
        if (err) { console.error(err) }
        res.should.have.status(200)
        res.body.should.be.a('object')
        res.body.message.should.be.eql('OK')
        res.body.content[0].should.be.eql(1)
        done()
      })
    })
  })
})