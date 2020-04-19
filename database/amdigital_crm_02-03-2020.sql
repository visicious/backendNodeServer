-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 02-03-2020 a las 17:50:38
-- Versión del servidor: 10.4.11-MariaDB
-- Versión de PHP: 7.4.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `crm_almacen`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `canales`
--

CREATE TABLE `canales` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `color` varchar(30) COLLATE utf8_general_mysql500_ci NOT NULL,
  `logo` varchar(150) COLLATE utf8_general_mysql500_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `canales`
--

INSERT INTO `canales` (`id`, `nombre`, `color`, `logo`) VALUES
(1, 'telefono', '#59626a', '/static/img/telefono_canal.png'),
(2, 'whatsapp', '#25d366', '/static/img/whatsapp_canal.png'),
(3, 'correo', '#000000', '/static/img/correo_canal.png');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombres` varchar(100) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `apellidos` varchar(100) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `genero` varchar(2) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `telefonoPrimario` varchar(20) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `telefonoSecundario` varchar(20) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `correoPrimario` varchar(100) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `correoSecundario` varchar(100) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `intencionCompra` tinyint(4) NOT NULL,
  `estado` varchar(40) COLLATE utf8_general_mysql500_ci NOT NULL,
  `ruc` int(11) DEFAULT NULL,
  `empresa` varchar(150) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `observacion` text COLLATE utf8_general_mysql500_ci NOT NULL,
  `horaFechaCreacion` datetime NOT NULL,
  `direccion` varchar(200) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `web` text COLLATE utf8_general_mysql500_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `clientes`
--

INSERT INTO `clientes` (`id`, `nombres`, `apellidos`, `genero`, `telefonoPrimario`, `telefonoSecundario`, `correoPrimario`, `correoSecundario`, `intencionCompra`, `estado`, `ruc`, `empresa`, `observacion`, `horaFechaCreacion`, `direccion`, `web`) VALUES
(1, 'Andres Alejandro', 'Juarez Jimenez', 'H', '544322132', NULL, NULL, NULL, 0, 'nuevo', NULL, NULL, '', '2020-02-14 09:54:15', 'Urb Manzana Roja, Calle Tobaco 13', 'and.all.ju.jim@hotmail.com'),
(2, NULL, NULL, NULL, NULL, NULL, 'empresa@probando.com', NULL, 0, 'nuevo', NULL, 'Inteligentes SAC', '', '2020-02-14 09:54:15', 'Urb Manzana Roja, Calle Tobaco 13', 'and.all.ju.jim@hotmail.com'),
(3, 'Andres ', 'Juarez Jimenez', 'H', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-17 10:35:24', 'Urb Manzana Roja, Calle Tobaco 13', 'www.gestion.pe'),
(4, 'Joel', 'Valdez', 'H', NULL, NULL, 'joel@probando.com', NULL, 0, 'perdido', NULL, '', '', '2020-02-17 11:03:33', '', NULL),
(5, 'Joel', 'Valdez', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-17 11:51:32', '', NULL),
(6, 'Jeeol', 'asdasd', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-17 11:58:04', '', NULL),
(7, 'Jeeol', 'asdasd', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-17 12:00:05', '', NULL),
(8, 'Juanito', 'Perez', 'H', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-17 13:39:19', '', NULL),
(9, 'Joel Johan', 'Valdez Angeles', 'H', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-17 13:40:46', '', NULL),
(10, 'Joel', 'Valdez', 'H', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-17 14:03:01', '', NULL),
(11, 'Joel Co', 'Valdez', 'H', NULL, NULL, NULL, NULL, 0, 'perdido', NULL, '', '', '2020-02-17 14:05:30', '', NULL),
(12, 'Joel', 'Valdez', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-17 14:06:45', '', NULL),
(13, 'Joel', 'Valdez', 'H', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-17 14:08:05', '', NULL),
(14, 'Joel', 'Valdez', 'H', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-17 14:09:18', '', NULL),
(15, 'JUan', 'Perez', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-18 10:07:43', '', NULL),
(16, 'jhon', 'Doe', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-18 10:08:39', '', NULL),
(17, 'Jhon', 'Doe', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-18 10:19:38', '', NULL),
(18, 'Julian', 'nose', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-18 10:20:53', '', NULL),
(19, 'Julian', 'nose', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-18 10:22:53', '', NULL),
(20, 'Julian', 'nose', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-18 10:24:40', '', NULL),
(21, 'Jhon', 'Doe', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-18 10:25:52', '', NULL),
(22, 'Joel', 'Valdez', 'H', NULL, NULL, NULL, NULL, 0, 'nuevo', NULL, '', '', '2020-02-18 12:21:51', '', NULL),
(23, 'Lizeth', 'Aguilar', 'M', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-18 12:23:56', '', NULL),
(24, 'amazon', 'quiero mi laptop', 'NA', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-18 12:29:48', '', NULL),
(25, '', '', '', NULL, NULL, NULL, NULL, 0, 'prospecto', 212390, 'La iberica', '', '2020-02-18 12:32:53', '', NULL),
(26, 'Lizeth Sharidhana', 'Aguilar Alvis', 'M', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-18 13:30:31', '', NULL),
(27, 'Juanito', 'Perez', 'H', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-19 12:33:48', '', NULL),
(28, 'Joel', 'Valdez', 'H', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-19 12:38:28', '', NULL),
(29, 'walmart', 'no acepta tarjetas bcp', 'H', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-19 12:41:35', '', NULL),
(30, 'Esteban Fernando', 'De la fuente Valenzuela', 'H', NULL, NULL, NULL, NULL, 0, 'prospecto', NULL, '', '', '2020-02-21 11:28:17', '', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `cantidadTrabajadores` int(11) NOT NULL,
  `ruc` int(11) DEFAULT NULL,
  `horaFechaCreacion` datetime NOT NULL,
  `idEncargado` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `empresas`
--

INSERT INTO `empresas` (`id`, `nombre`, `cantidadTrabajadores`, `ruc`, `horaFechaCreacion`, `idEncargado`) VALUES
(1, 'Ninguna', 1, NULL, '2020-02-10 14:52:51', NULL),
(2, 'Kopac Q\'ori', 50, NULL, '2020-02-11 10:14:38', NULL),
(3, 'Kopac', 50, NULL, '2020-02-11 11:51:02', NULL),
(4, 'Alguna', 1, NULL, '2020-02-11 12:15:41', NULL),
(5, 'Esa', 1, NULL, '2020-02-11 12:16:15', NULL),
(6, 'Michell SAC', 1, NULL, '2020-02-11 12:16:45', NULL),
(7, 'Cnata', 50, NULL, '2020-02-11 12:17:43', NULL),
(8, 'Cuasi modo', 50, NULL, '2020-02-11 12:25:14', NULL),
(9, 'naides', 1, NULL, '2020-02-11 12:26:01', NULL),
(10, 'adada', 1, NULL, '2020-02-11 12:26:34', NULL),
(11, '1121', 1, NULL, '2020-02-11 12:54:47', NULL),
(12, 'rotoo', 50, NULL, '2020-02-11 12:57:19', NULL),
(13, '98898989', 1, NULL, '2020-02-11 13:09:29', NULL);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_embudo_ventas`
--

CREATE TABLE `estados_embudo_ventas` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `nombre` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `orden` tinyint(4) NOT NULL,
  `horaFechaCreacion` datetime NOT NULL,
  `horaFechaModificacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `estados_embudo_ventas`
--

INSERT INTO `estados_embudo_ventas` (`id`, `idUsuario`, `nombre`, `orden`, `horaFechaCreacion`, `horaFechaModificacion`) VALUES
(1, 1, 'Prospectos', 0, '2020-02-13 12:01:54', '2020-02-13 12:01:54'),
(2, 1, 'Contactados', 1, '2020-02-13 12:04:11', '2020-02-13 12:04:11'),
(3, 1, 'Negociación Iniciada', 2, '2020-02-13 12:04:28', '2020-02-13 12:04:28'),
(4, 1, 'Pendientes de Cierre', 3, '2020-02-13 12:04:42', '2020-02-13 12:04:42'),
(5, 1, 'Ejemplo', 4, '2020-02-13 12:16:17', '2020-02-13 12:16:17');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `interacciones`
--

CREATE TABLE `interacciones` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idProspecto` int(11) NOT NULL,
  `idCanal` int(11) DEFAULT NULL,
  `canal` varchar(70) COLLATE utf8_general_mysql500_ci NOT NULL,
  `horaFechaCreacion` datetime NOT NULL,
  `horaFechaInicio` datetime NOT NULL,
  `horaFechaTermino` datetime DEFAULT NULL,
  `estadoInteraccion` smallint(6) NOT NULL,
  `comentario` text COLLATE utf8_general_mysql500_ci NOT NULL,
  `eliminar` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `interacciones`
--

INSERT INTO `interacciones` (`id`, `idUsuario`, `idProspecto`, `idCanal`, `canal`, `horaFechaCreacion`, `horaFechaInicio`, `horaFechaTermino`, `estadoInteraccion`, `comentario`, `eliminar`) VALUES
(1, 1, 1, NULL, 'whatsapp', '2020-02-24 00:00:00', '2020-02-24 00:00:00', NULL, 1, 'El cliente fue muy rapido al contestar el mensaje.', 0),
(2, 1, 1, NULL, 'whatsapp', '2020-02-29 10:17:35', '2020-02-29 09:12:18', '2020-02-29 10:17:35', 0, 'El cliente contestó de buena manera el ofrecimiento del paquete de 3 celulares por el precio de 1. Quedó agendada una llamada para el próximo lunes y cerrar el trato', 0),
(3, 1, 1, NULL, 'whatsapp', '2020-02-28 11:37:41', '2020-02-28 11:37:41', '2020-02-28 19:12:01', -1, 'Hubo un interes en la publicidad enviada por whatsapp y se hicieron consultas iniciales sobre precios. Quedó un mensaje pendiente para poder agendar una llamada', 0),
(4, 1, 1, NULL, 'whatsapp', '2020-02-28 11:37:41', '2020-02-28 11:37:41', '2020-02-28 19:12:01', 1, 'Hubo un interes en la publicidad enviada por whatsapp y se hicieron consultas iniciales sobre precios. Quedó un mensaje pendiente para poder agendar una llamada', 0),
(5, 1, 1, NULL, 'whatsapp', '2020-02-28 11:37:41', '2020-02-28 11:37:41', '2020-02-28 19:12:01', 1, 'Hubo un interes en la publicidad enviada por whatsapp y se hicieron consultas iniciales sobre precios. Quedó un mensaje pendiente para poder agendar una llamada', 0),
(6, 1, 1, NULL, 'whatsapp', '2020-02-28 11:37:41', '2020-02-28 11:37:41', '2020-02-28 19:12:01', 1, 'Hubo un interes en la publicidad enviada por whatsapp y se hicieron consultas iniciales sobre precios. Quedó un mensaje pendiente para poder agendar una llamada', 0),
(11, 1, 19, NULL, 'whatsapp', '2020-02-29 11:34:09', '2020-02-13 00:00:00', NULL, 0, '', 1),
(12, 1, 19, NULL, 'whatsapp', '2020-02-29 11:42:10', '2020-02-07 11:41:00', '2020-02-19 11:41:00', 1, '123456789', 0),
(13, 1, 19, NULL, 'whatsapp', '2020-02-29 11:48:11', '2020-02-14 11:48:00', NULL, 0, '', 1),
(14, 1, 19, NULL, 'whatsapp', '2020-02-29 11:50:02', '2020-02-08 11:49:00', NULL, 0, '', 0),
(15, 1, 19, NULL, 'whatsapp', '2020-02-29 11:51:40', '2020-02-13 11:51:00', NULL, 0, '', 1),
(16, 1, 19, NULL, 'whatsapp', '2020-02-29 11:52:25', '2020-02-28 11:52:00', NULL, -1, '', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medios_comunicacion_clientes`
--

CREATE TABLE `medios_comunicacion_clientes` (
  `id` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `idCanal` int(11) NOT NULL,
  `nombre` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `valor` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `estaActivo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

CREATE TABLE `planes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `costo` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `beneficios` text COLLATE utf8_general_mysql500_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `planes`
--

INSERT INTO `planes` (`id`, `nombre`, `costo`, `beneficios`) VALUES
(1, 'Basico', 'S/. 99,51', 'Muchas horas de mantenimiento, de cambios aleatorios de codigo, de posibilidades infinitas de llamadas y de funcionamientos que no estamos esperando que necesiten pero que van a pedir porque ya los conocemos....'),
(2, 'Plus', 'S/. 150,98', 'Mismas habilidades que la version anterior más la capacidad de manejo de varias cuentas por su parte, tipo para que no sea uno el que fastidie sino un grupo de 5. Oh y que en este plan les vamos a poner buena cara :)'),
(3, 'Avanzado', 'S/. 210,62', 'Bueno, por este plan estamos a su total disposicion. Cambios ilimitados, soporte total y uso de sarcasmo al mínimo. Sabemos que en pleno siglo XXI no debería haber esclavitud, pero lo que esta contratando se le parece. A sus ordenes amos!');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prospectos`
--

CREATE TABLE `prospectos` (
  `id` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL,
  `porcentajeCierre` float NOT NULL,
  `prioridad` tinyint(4) NOT NULL,
  `horaFechaCreacion` datetime NOT NULL,
  `horaFechaContacto` datetime DEFAULT NULL,
  `estadoFinalizacion` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `comentario` text COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `idEstadoEmbudoVenta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `prospectos`
--

INSERT INTO `prospectos` (`id`, `idCliente`, `porcentajeCierre`, `prioridad`, `horaFechaCreacion`, `horaFechaContacto`, `estadoFinalizacion`, `comentario`, `idEstadoEmbudoVenta`) VALUES
(1, 3, 0.1, 5, '2020-02-17 10:35:24', NULL, 'pendiente', NULL, 3),
(2, 4, 0.154, 5, '2020-02-17 11:03:33', '2020-02-05 00:00:00', 'perdido', NULL, 2),
(3, 8, 0.5, 10, '2020-02-17 13:39:19', '2020-02-18 00:00:00', 'pendiente', NULL, 3),
(4, 9, 1, 5, '2020-02-17 13:40:46', '2020-02-13 00:00:00', 'pendiente', NULL, 1),
(5, 10, 0, 5, '2020-02-17 14:03:01', '2020-03-03 00:00:00', 'pendiente', NULL, 4),
(6, 11, 0, 5, '2020-02-17 14:05:31', NULL, 'ganado', NULL, 2),
(7, 11, 0, 5, '2020-02-17 14:06:45', '2020-02-17 00:00:00', 'perdido', NULL, 3),
(8, 13, 0, 3, '2020-02-17 14:08:05', NULL, 'pendiente', NULL, 5),
(9, 14, 0, 9, '2020-02-17 14:09:18', NULL, 'pendiente', NULL, 4),
(10, 21, 0.1, 1, '2020-02-18 10:25:52', '2020-02-18 00:00:00', 'eliminado', NULL, 4),
(11, 22, 0.5, 5, '2020-02-18 12:21:51', NULL, 'eliminado', NULL, 4),
(12, 23, 0.6, 2, '2020-02-18 12:23:56', '2020-02-13 00:00:00', 'pendiente', NULL, 3),
(13, 24, 0.2, 1, '2020-02-18 12:29:48', '2020-02-06 00:00:00', 'pendiente', NULL, 5),
(14, 25, 0.7, 5, '2020-02-18 12:32:53', '2020-02-05 00:00:00', 'pendiente', NULL, 4),
(15, 26, 1, 10, '2020-02-18 13:30:31', NULL, 'pendiente', NULL, 2),
(16, 27, 0.5, 5, '2020-02-19 12:33:48', NULL, 'pendiente', NULL, 2),
(17, 28, 0.5, 2, '2020-02-19 12:38:28', NULL, 'pendiente', NULL, 1),
(18, 29, 0.2, 10, '2020-02-19 12:41:35', '2020-02-15 00:00:00', 'pendiente', NULL, 2),
(19, 30, 0.08, 1, '2020-02-21 11:28:17', NULL, 'pendiente', NULL, 5);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombres` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `usuario` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `password` varchar(128) COLLATE utf8_general_mysql500_ci NOT NULL,
  `usuarioSalt` varchar(16) COLLATE utf8_general_mysql500_ci NOT NULL,
  `usuarioHash` varchar(64) COLLATE utf8_general_mysql500_ci NOT NULL,
  `token` text COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `horaFechaCreacion` datetime NOT NULL,
  `correo` varchar(150) COLLATE utf8_general_mysql500_ci NOT NULL,
  `celular` int(11) DEFAULT NULL,
  `imagen` text COLLATE utf8_general_mysql500_ci NOT NULL,
  `estaActivo` tinyint(4) NOT NULL,
  `rol` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `opcionVentanaMail` tinyint(4) NOT NULL,
  `nivelesPrioridad` tinyint(4) NOT NULL,
  `horaFechaInactivo` datetime DEFAULT NULL,
  `idEmpresa` int(11) NOT NULL,
  `idPlan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `nombres`, `apellidos`, `usuario`, `password`, `usuarioSalt`, `usuarioHash`, `token`, `horaFechaCreacion`, `correo`, `celular`, `imagen`, `estaActivo`, `rol`, `opcionVentanaMail`, `nivelesPrioridad`, `horaFechaInactivo`, `idEmpresa`, `idPlan`) VALUES
(1, 'Joel', 'Valdez', 'jo3lv4ld3z', '123456789', '312e213f8e4dd1d7', '12276192404feb17f2bcec1363e90f9f45a99c4179c4af95c7d48a10738b44e9', NULL, '2020-02-11 10:40:15', 'admin@amdigitalcrm.com', 959356464, 'fotos_usuario/foto.jpg', 1, 'administrador', 7, 5, NULL, 1, 1),
(4, 'Joel', 'Valdez', 'jo3lv4ld3z', '123456789', '36147925b6fd5249', 'da0bbe799dac34938683fa0c9d42826be7de4da9a170659ad4f133386aa82c9e', NULL, '2020-02-11 11:25:51', 'jean1993@hotmail.com', 959356464, 'fotos_usuario/foto.jpg', 1, 'administrador', 7, 5, NULL, 1, 1),
(5, 'Joel', 'Valdez', 'jo3lv4ld3z', '123456789', '6bff0e529a8744ad', '7157ecc29bfc4a67b71370a0ae0d794272e22729bddf8ba954dcf836e7dd1b73', NULL, '2020-02-11 12:16:45', 'jean199@hotmail.com', 959356464, 'fotos_usuario/foto.jpg', 1, 'administrador', 7, 5, NULL, 6, 1),
(6, 'Joel', 'Valdez', 'jo3lv4ld3z', '123456789', 'ed1a3eef1e72ccf8', '0ea978a98234fe8d7be805489a9c4adc7b73c90fd72493eb684dded80fb14be6', NULL, '2020-02-11 12:18:23', 'aaffaaf@hotmail.com', 959356464, 'fotos_usuario/foto.jpg', 1, 'administrador', 7, 5, NULL, 1, 1),
(7, 'Joel', 'Valdez', 'jo3lv4ld3z', '123456789', '1531800a738915f3', '6a42d8e42a01ace818fc04e961042f20ab23b56f608d23d64c458c69a5132506', NULL, '2020-02-11 12:24:59', 'asaas@hotmail.com', 959356464, 'fotos_usuario/foto.jpg', 1, 'administrador', 7, 5, NULL, 1, 1),
(8, 'Joel', 'Valdez', 'jo3lv4ld3z', '123456789', 'c096460d7be2c622', '9681c95772cc371b1d7aaec48b371f9817eed7a7ed49c7d7a41f364b9f67af8d', NULL, '2020-02-11 12:26:34', 'dkladskjlfadfskjl@hotmail.com', 959356464, 'fotos_usuario/foto.jpg', 1, 'administrador', 7, 5, NULL, 10, 1),
(9, 'Joel', 'Valdez', 'jo3lv4ld3z', '123456789', 'cfa2b15418953507', '7a654707ba985de0b5b0ac45afd47c35e46ad294b8e472ff07e53a9e3c697b52', NULL, '2020-02-11 12:54:47', '13212321@hotmail.com', 959356464, 'fotos_usuario/foto.jpg', 1, 'administrador', 7, 5, NULL, 11, 1),
(10, 'Joel', 'Valdez', 'jo3lv4ld3z', '123456789', '1719002bd4815b9a', '4be4668a00c8f7d076919023d05047e335c9f7da85282096fa052ff7d91353e5', NULL, '2020-02-11 12:57:34', 'oopoypyo@hotmail.com', 959356464, 'fotos_usuario/foto.jpg', 1, 'administrador', 7, 5, NULL, 1, 1),
(11, 'Joel', 'Valdez', 'jo3lv4ld3z', '123456789', '7caf0a704d84b4eb', '916810386bbf10901ed0fafe5a0a5a4559a8f2d7e073c42509f1fd73ef537fda', NULL, '2020-02-11 13:07:51', '5655656@hotmail.com', 959356464, 'fotos_usuario/foto.jpg', 1, 'administrador', 7, 5, NULL, 1, 1),
(12, 'Joel', 'Valdez', 'jo3lv4ld3z', '123456789', '98d820f037846089', '088743f6a219891825399d69b5c1289ef7f94e8fafaa7826976c8b0e6196a606', NULL, '2020-02-11 13:09:29', '111111111111111111111@hotmail.com', 959356464, 'fotos_usuario/foto.jpg', 1, 'administrador', 7, 5, NULL, 13, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_x_clientes`
--

CREATE TABLE `usuarios_x_clientes` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idCliente` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `usuarios_x_clientes`
--

INSERT INTO `usuarios_x_clientes` (`id`, `idUsuario`, `idCliente`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7),
(8, 1, 8),
(9, 1, 9),
(10, 1, 10),
(11, 1, 11),
(12, 1, 12),
(13, 1, 13),
(14, 1, 14),
(15, 1, 15),
(16, 1, 16),
(17, 1, 17),
(18, 1, 18),
(19, 1, 19),
(20, 1, 20),
(21, 1, 21),
(22, 1, 22),
(23, 1, 23),
(24, 1, 24),
(25, 1, 25),
(26, 1, 26),
(27, 1, 27),
(28, 1, 28),
(29, 1, 29),
(30, 1, 30);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_x_prospectos`
--

CREATE TABLE `usuarios_x_prospectos` (
  `id` int(11) NOT NULL,
  `idUsuario` int(11) NOT NULL,
  `idProspecto` int(11) NOT NULL,
  `idUsuarioCierre` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

--
-- Volcado de datos para la tabla `usuarios_x_prospectos`
--

INSERT INTO `usuarios_x_prospectos` (`id`, `idUsuario`, `idProspecto`, `idUsuarioCierre`) VALUES
(1, 1, 6, NULL),
(2, 1, 18, NULL),
(3, 1, 2, NULL),
(4, 1, 3, NULL),
(5, 1, 4, NULL),
(6, 1, 19, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `canales`
--
ALTER TABLE `canales`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `clientes`
--
ALTER TABLE `clientes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `empresas_usuarios_id_encargado` (`idEncargado`);

--
-- Indices de la tabla `estados_embudo_ventas`
--
ALTER TABLE `estados_embudo_ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_estados_embudo_ventas_id_usuario` (`idUsuario`);

--
-- Indices de la tabla `interacciones`
--
ALTER TABLE `interacciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `canales_interacciones_id_canal` (`idCanal`),
  ADD KEY `usuarios_interacciones_id_usuario` (`idUsuario`),
  ADD KEY `usuarios_interacciones_id_prospecto` (`idProspecto`);

--
-- Indices de la tabla `medios_comunicacion_clientes`
--
ALTER TABLE `medios_comunicacion_clientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clientes_medios_comunicacion_clientes_id_cliente` (`idCliente`),
  ADD KEY `canales_medios_comunicacion_clientes_id_canal` (`idCanal`);

--
-- Indices de la tabla `planes`
--
ALTER TABLE `planes`
  ADD PRIMARY KEY (`id`);

--
-- Indices de la tabla `prospectos`
--
ALTER TABLE `prospectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `prospectos_clientes_id_cliente` (`idCliente`),
  ADD KEY `prospectos_estados_embudo_ventas_id_estado_embudo_venta` (`idEstadoEmbudoVenta`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_empresas_id_empresa` (`idEmpresa`),
  ADD KEY `usuarios_planes_id_plan` (`idPlan`);

--
-- Indices de la tabla `usuarios_x_clientes`
--
ALTER TABLE `usuarios_x_clientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_usuarios_x_clientes_id_usuario` (`idUsuario`),
  ADD KEY `clientes_usuarios_x_clientes_id_cliente` (`idCliente`);

--
-- Indices de la tabla `usuarios_x_prospectos`
--
ALTER TABLE `usuarios_x_prospectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_usuarios_x_prospecto_id_usuario` (`idUsuario`),
  ADD KEY `prospectos_usuarios_x_prospecto_id_prospecto` (`idProspecto`),
  ADD KEY `usuarios_usuarios_x_prospecto_id_usuario_cierre` (`idUsuarioCierre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `canales`
--
ALTER TABLE `canales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT de la tabla `estados_embudo_ventas`
--
ALTER TABLE `estados_embudo_ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `interacciones`
--
ALTER TABLE `interacciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `medios_comunicacion_clientes`
--
ALTER TABLE `medios_comunicacion_clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `prospectos`
--
ALTER TABLE `prospectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `usuarios_x_clientes`
--
ALTER TABLE `usuarios_x_clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=31;

--
-- AUTO_INCREMENT de la tabla `usuarios_x_prospectos`
--
ALTER TABLE `usuarios_x_prospectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD CONSTRAINT `empresas_usuarios_id_encargado` FOREIGN KEY (`idEncargado`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `estados_embudo_ventas`
--
ALTER TABLE `estados_embudo_ventas`
  ADD CONSTRAINT `usuarios_estados_embudo_ventas_id_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `interacciones`
--
ALTER TABLE `interacciones`
  ADD CONSTRAINT `canales_interacciones_id_canal` FOREIGN KEY (`idCanal`) REFERENCES `canales` (`id`),
  ADD CONSTRAINT `usuarios_interacciones_id_prospecto` FOREIGN KEY (`idProspecto`) REFERENCES `prospectos` (`id`),
  ADD CONSTRAINT `usuarios_interacciones_id_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `medios_comunicacion_clientes`
--
ALTER TABLE `medios_comunicacion_clientes`
  ADD CONSTRAINT `canales_medios_comunicacion_clientes_id_canal` FOREIGN KEY (`idCanal`) REFERENCES `canales` (`id`),
  ADD CONSTRAINT `clientes_medios_comunicacion_clientes_id_cliente` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`);

--
-- Filtros para la tabla `prospectos`
--
ALTER TABLE `prospectos`
  ADD CONSTRAINT `prospectos_clientes_id_cliente` FOREIGN KEY (`idCliente`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `prospectos_estados_embudo_ventas_id_estado_embudo_venta` FOREIGN KEY (`idEstadoEmbudoVenta`) REFERENCES `estados_embudo_ventas` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_empresas_id_empresa` FOREIGN KEY (`idEmpresa`) REFERENCES `empresas` (`id`),
  ADD CONSTRAINT `usuarios_planes_id_plan` FOREIGN KEY (`idPlan`) REFERENCES `planes` (`id`);

--
-- Filtros para la tabla `usuarios_x_prospectos`
--
ALTER TABLE `usuarios_x_prospectos`
  ADD CONSTRAINT `prospectos_usuarios_x_prospecto_id_prospecto` FOREIGN KEY (`idProspecto`) REFERENCES `prospectos` (`id`),
  ADD CONSTRAINT `usuarios_usuarios_x_prospecto_id_usuario` FOREIGN KEY (`idUsuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `usuarios_usuarios_x_prospecto_id_usuario_cierre` FOREIGN KEY (`idUsuarioCierre`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
