/* ------------------------------------------------------------------------------------- */
/*                         CONFIGURACIÓN DEL BACKEND (Portal PROGEN)                     */
/* ------------------------------------------------------------------------------------- */
/*
  Único lugar donde se define a qué backend llama el formulario.

  TODO producción: cambiar API_BASE_URL por la URL pública del backend
  desplegado (https://.../api/v1) y, en el .env de ese backend, agregar el
  dominio de este sitio a REGISTRO_CLIENTES_ORIGENES y a ALLOWED_ORIGINS.
*/
const API_BASE_URL = "http://localhost:3000/api/v1";

const REGISTRO_API_URL = API_BASE_URL + "/externo/registro-clientes";
const VALIDACION_API_URL = API_BASE_URL + "/validacion-documentos";

/*
  true: el archivo se manda al backend (PUT /:numero/adjuntos/:id/archivo) y
  él lo sube a S3, así el bucket no necesita CORS.
  false: el navegador sube directo a S3 con el enlace firmado; el bucket debe
  permitir PUT desde el origen de este sitio.
*/
const SUBIDA_POR_BACKEND = true;
