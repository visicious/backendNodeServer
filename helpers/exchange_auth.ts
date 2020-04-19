const jwt = require('jsonwebtoken');

const credenciales = {
  client: {
    id: process.env.APP_ID,
    secret: process.env.APP_PASSWORD,
  },
  auth: {
    tokenHost: 'https://login.microsoftonline.com',
    authorizePath: 'common/oauth2/v2.0/authorize',
    tokenPath: 'common/oauth2/v2.0/token'
  }
};
const oauth2 = require('simple-oauth2').create(credenciales);

export const obtenerUrlAutenticacion = () => {
  const urlAutorizada = oauth2.authorizationCode.authorizeURL({
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  });
  console.log(`Url de autenticación generada: ${urlAutorizada}`);
  return urlAutorizada;
};

export const generarTokenDeCodigo = async(auth_code:any) => {
  let result = await oauth2.authorizationCode.getToken({
    code: auth_code,
    redirect_uri: process.env.REDIRECT_URI,
    scope: process.env.APP_SCOPES
  });

  const token = oauth2.accessToken.create(result);
  console.log('Token creado: ', token.token);

  return generarDatosAutenticacion(token);
};

export const generarDatosAutenticacion = (token:any) => {
  const usuario = jwt.decode(token.token.id_token);
  const cookies = jwt.sign({
    graph_access_token: token.token.access_token,
    graph_user_name: usuario.name,
    graph_refresh_token: token.token.refresh_token,
    graph_token_expires: token.token.expires_at.getTime()
  }, 'cookies_exchange_crm_node', { expiresIn: '1h' }, { algorithm: 'RS256' });

  const autenticacion = {
    token: token.token.access_token,
    refresh_token: token.token.refresh_token,
    token_expires: token.token.expires_at.getTime(),
    correo: usuario.preferred_username,
    cookies: cookies
  }

  return autenticacion;
};

export const refrescarTokenAcceso = async (autenticacion:any) => {
  // Do we have an access token cached?
  let token = autenticacion.token;

  if (token) {
    // We have a token, but is it expired?
    // Expire 5 minutes early to account for clock differences
    const CINCO_MINUTOS = 300000;
    const fechaExpiracion:any = parseInt(autenticacion.token_expires) - CINCO_MINUTOS;
    const expiracion = new Date(fechaExpiracion);
    if (expiracion > new Date()) {
      // Token is still good, just return it
      return autenticacion;
    }
  }

  // Either no token or it's expired, do we have a
  // refresh token?
  const refresh_token = autenticacion.refresh_token;
  if (refresh_token) {
    const newToken = await oauth2.accessToken.create({refresh_token: refresh_token}).refresh();
    return generarDatosAutenticacion(newToken);
  }

  // Nothing in the cookies that helps, return empty
  return null;
};