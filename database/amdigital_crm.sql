-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 04-02-2020 a las 16:27:15
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
-- Base de datos: `amdigital_crm`
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

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `clientes`
--

CREATE TABLE `clientes` (
  `id` int(11) NOT NULL,
  `nombres` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `apellidos` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `intencion_compra` tinyint(4) NOT NULL,
  `ruc` int(11) DEFAULT NULL,
  `empresa` varchar(100) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `observacion` text COLLATE utf8_general_mysql500_ci NOT NULL,
  `hora_fecha_creacion` datetime NOT NULL,
  `direccion` varchar(200) COLLATE utf8_general_mysql500_ci DEFAULT NULL,
  `web` text COLLATE utf8_general_mysql500_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empresas`
--

CREATE TABLE `empresas` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `cantidad_trabajadores` int(11) NOT NULL,
  `ruc` int(11) DEFAULT NULL,
  `hora_fecha_creacion` datetime NOT NULL,
  `id_encargado` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `estados_embudo_ventas`
--

CREATE TABLE `estados_embudo_ventas` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `nombre` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `orden` tinyint(4) NOT NULL,
  `hora_fecha_creacion` datetime NOT NULL,
  `hora_fecha_modificacion` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `interacciones`
--

CREATE TABLE `interacciones` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_prospecto` int(11) NOT NULL,
  `id_canal` int(11) NOT NULL,
  `hora_fecha_inicio` datetime NOT NULL,
  `hora_fecha_termino` datetime DEFAULT NULL,
  `estado_interaccion` smallint(6) NOT NULL,
  `comentario` text COLLATE utf8_general_mysql500_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `medios_comunicacion_clientes`
--

CREATE TABLE `medios_comunicacion_clientes` (
  `id` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `id_canal` int(11) NOT NULL,
  `nombre` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `valor` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `esta_activo` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `planes`
--

CREATE TABLE `planes` (
  `id` int(11) NOT NULL,
  `nombre` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `costo` float NOT NULL,
  `beneficios` text COLLATE utf8_general_mysql500_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `prospectos`
--

CREATE TABLE `prospectos` (
  `id` int(11) NOT NULL,
  `id_cliente` int(11) NOT NULL,
  `probabilidad_cierre` float NOT NULL,
  `prioridad` tinyint(4) NOT NULL,
  `hora_fecha_creacion` datetime NOT NULL,
  `hora_fecha_contacto` datetime NOT NULL,
  `estado_finalizacion` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `id_estado_embudo_venta` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nombre` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `apellido` varchar(100) COLLATE utf8_general_mysql500_ci NOT NULL,
  `usuario` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `password` varchar(128) COLLATE utf8_general_mysql500_ci NOT NULL,
  `usuario_salt` varchar(16) COLLATE utf8_general_mysql500_ci NOT NULL,
  `usuario_hash` varchar(64) COLLATE utf8_general_mysql500_ci NOT NULL,
  `token` text COLLATE utf8_general_mysql500_ci NOT NULL,
  `hora_fecha_creacion` datetime NOT NULL,
  `correo` varchar(150) COLLATE utf8_general_mysql500_ci NOT NULL,
  `celular` int(11) DEFAULT NULL,
  `imagen` text COLLATE utf8_general_mysql500_ci NOT NULL,
  `esta_activo` tinyint(4) NOT NULL,
  `rol` varchar(50) COLLATE utf8_general_mysql500_ci NOT NULL,
  `opcion_ventana_mail` tinyint(4) NOT NULL,
  `niveles_prioridad` tinyint(4) NOT NULL,
  `hora_fecha_inactivo` datetime DEFAULT NULL,
  `id_empresa` int(11) NOT NULL,
  `id_plan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios_x_prospectos`
--

CREATE TABLE `usuarios_x_prospectos` (
  `id` int(11) NOT NULL,
  `id_usuario` int(11) NOT NULL,
  `id_prospecto` int(11) NOT NULL,
  `id_usuario_cierre` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_mysql500_ci;

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
  ADD KEY `empresas_usuarios_id_encargado` (`id_encargado`);

--
-- Indices de la tabla `estados_embudo_ventas`
--
ALTER TABLE `estados_embudo_ventas`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_estados_embudo_ventas_id_usuario` (`id_usuario`);

--
-- Indices de la tabla `interacciones`
--
ALTER TABLE `interacciones`
  ADD PRIMARY KEY (`id`),
  ADD KEY `canales_interacciones_id_canal` (`id_canal`),
  ADD KEY `usuarios_interacciones_id_usuario` (`id_usuario`),
  ADD KEY `usuarios_interacciones_id_prospecto` (`id_prospecto`);

--
-- Indices de la tabla `medios_comunicacion_clientes`
--
ALTER TABLE `medios_comunicacion_clientes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `clientes_medios_comunicacion_clientes_id_cliente` (`id_cliente`),
  ADD KEY `canales_medios_comunicacion_clientes_id_canal` (`id_canal`);

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
  ADD KEY `prospectos_clientes_id_cliente` (`id_cliente`),
  ADD KEY `prospectos_estados_embudo_ventas_id_estado_embudo_venta` (`id_estado_embudo_venta`);

--
-- Indices de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_empresas_id_empresa` (`id_empresa`),
  ADD KEY `usuarios_planes_id_plan` (`id_plan`);

--
-- Indices de la tabla `usuarios_x_prospectos`
--
ALTER TABLE `usuarios_x_prospectos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `usuarios_usuarios_x_prospecto_id_usuario` (`id_usuario`),
  ADD KEY `prospectos_usuarios_x_prospecto_id_prospecto` (`id_prospecto`),
  ADD KEY `usuarios_usuarios_x_prospecto_id_usuario_cierre` (`id_usuario_cierre`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `canales`
--
ALTER TABLE `canales`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `clientes`
--
ALTER TABLE `clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `empresas`
--
ALTER TABLE `empresas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `estados_embudo_ventas`
--
ALTER TABLE `estados_embudo_ventas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `interacciones`
--
ALTER TABLE `interacciones`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `medios_comunicacion_clientes`
--
ALTER TABLE `medios_comunicacion_clientes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `planes`
--
ALTER TABLE `planes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `prospectos`
--
ALTER TABLE `prospectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `usuarios_x_prospectos`
--
ALTER TABLE `usuarios_x_prospectos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `empresas`
--
ALTER TABLE `empresas`
  ADD CONSTRAINT `empresas_usuarios_id_encargado` FOREIGN KEY (`id_encargado`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `estados_embudo_ventas`
--
ALTER TABLE `estados_embudo_ventas`
  ADD CONSTRAINT `usuarios_estados_embudo_ventas_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `interacciones`
--
ALTER TABLE `interacciones`
  ADD CONSTRAINT `canales_interacciones_id_canal` FOREIGN KEY (`id_canal`) REFERENCES `canales` (`id`),
  ADD CONSTRAINT `usuarios_interacciones_id_prospecto` FOREIGN KEY (`id_prospecto`) REFERENCES `prospectos` (`id`),
  ADD CONSTRAINT `usuarios_interacciones_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`);

--
-- Filtros para la tabla `medios_comunicacion_clientes`
--
ALTER TABLE `medios_comunicacion_clientes`
  ADD CONSTRAINT `canales_medios_comunicacion_clientes_id_canal` FOREIGN KEY (`id_canal`) REFERENCES `canales` (`id`),
  ADD CONSTRAINT `clientes_medios_comunicacion_clientes_id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`);

--
-- Filtros para la tabla `prospectos`
--
ALTER TABLE `prospectos`
  ADD CONSTRAINT `prospectos_clientes_id_cliente` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`),
  ADD CONSTRAINT `prospectos_estados_embudo_ventas_id_estado_embudo_venta` FOREIGN KEY (`id_estado_embudo_venta`) REFERENCES `estados_embudo_ventas` (`id`);

--
-- Filtros para la tabla `usuarios`
--
ALTER TABLE `usuarios`
  ADD CONSTRAINT `usuarios_empresas_id_empresa` FOREIGN KEY (`id_empresa`) REFERENCES `empresas` (`id`),
  ADD CONSTRAINT `usuarios_planes_id_plan` FOREIGN KEY (`id_plan`) REFERENCES `planes` (`id`);

--
-- Filtros para la tabla `usuarios_x_prospectos`
--
ALTER TABLE `usuarios_x_prospectos`
  ADD CONSTRAINT `prospectos_usuarios_x_prospecto_id_prospecto` FOREIGN KEY (`id_prospecto`) REFERENCES `prospectos` (`id`),
  ADD CONSTRAINT `usuarios_usuarios_x_prospecto_id_usuario` FOREIGN KEY (`id_usuario`) REFERENCES `usuarios` (`id`),
  ADD CONSTRAINT `usuarios_usuarios_x_prospecto_id_usuario_cierre` FOREIGN KEY (`id_usuario_cierre`) REFERENCES `usuarios` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
