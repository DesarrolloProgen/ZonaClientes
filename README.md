# Zona Clientes: formulario de registro de clientes

Formulario público (HTML + jQuery + Bootstrap, sin build) con el que un cliente solicita su inscripción o actualización en
PROGEN y consulta el estado de su solicitud. Ya no usa Power Automate: habla con el backend del Portal PROGEN
(`portal-progen-backend`), módulos `registro-clientes` y `validacion-documentos`.

El contrato completo está en `portal-progen-backend/docs/registro-clientes-api.md`.

## Configuración

Todo está en `js/config.js`:

| Constante            | Qué es                                                                                                                                     |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `API_BASE_URL`       | Base de la API del backend. En local: `http://localhost:3000/api/v1`. **TODO producción:** la URL pública del backend.                     |
| `SUBIDA_POR_BACKEND` | `true` (por defecto): los archivos se mandan al backend y él los sube a S3. `false`: el navegador sube directo a S3 con el enlace firmado. |

En el `.env` del backend deben estar:

- `REGISTRO_CLIENTES_SECRETO`: al menos 32 caracteres aleatorios. Sin ella la API responde 503.
- `REGISTRO_CLIENTES_ORIGENES`: el origen exacto desde donde se sirve este formulario (p. ej. `http://localhost:5500`). Otro
  origen recibe 403.
- `ALLOWED_ORIGINS`: el mismo origen, para el CORS de `/validacion-documentos`.
- `REGISTRO_CLIENTES_TEXTO_AUTORIZACION`: texto de la casilla de autorización de datos. Vacía = un texto genérico del
  backend.
- `S3_BUCKET_ADJUNTOS` y `S3_PREFIJO`, las credenciales de AWS, `GEMINI_API_KEY` (validación con IA) y el correo (`GRAPH_*` o
  `SMTP_*`).
- Opcionales: `RATE_LIMIT_REGISTRO_CLIENTES_MAX` (60 por minuto) y `RATE_LIMIT_REGISTRO_CLIENTES_ENVIOS_MAX` (10 altas,
  envíos o consultas por hora y por IP).

Con `SUBIDA_POR_BACKEND = false`, el bucket debe permitir por CORS `PUT` desde el origen del formulario, con los encabezados
`Content-Type` y `Content-Length`.

## Correr en local

1. Levanta el backend (puerto 3000) con las variables de arriba.
2. Sirve esta carpeta en el origen configurado, por ejemplo con Live Server de VS Code (puerto 5500) o
   `python3 -m http.server 5500 --bind 127.0.0.1`, y abre `http://localhost:5500`. Debe ser `localhost` y no `127.0.0.1`,
   porque el origen tiene que coincidir exactamente.

## Cómo funciona

1. Al cargar, `GET /externo/registro-clientes/formulario` trae el token del formulario, las listas (tipos, divisiones y
   comerciales), los documentos por caso, los límites de los adjuntos y el texto de autorización. Nada de eso está fijo en
   el HTML: las divisiones y los comerciales se administran desde el portal.
2. Cada archivo se revisa contra los límites (10 MB; PDF, imágenes, Word o Excel). Los documentos con `tipoValidacion` se
   aceptan sólo en PDF o imagen y se envían a `POST /validacion-documentos`. El RUT lleva `datosReferencia.nit`, y la
   cédula del representante, `datosReferencia.numeroDocumento` cuando el cliente es persona con CC. Si la IA rechaza un
   documento, se muestra el `motivo` y el envío queda bloqueado. Si la IA lo aprueba, se guarda su `comprobante`.
3. Al enviar: `POST /` crea el borrador. Luego, por cada archivo: `POST /:numero/adjuntos` (con el comprobante), la subida y
   `POST .../confirmar`. Al final, `POST /:numero/enviar`. Siempre se muestra el `message` de error del backend: 409 por
   documentos faltantes o por una solicitud ya en trámite, 400 por un comprobante inválido o un archivo distinto al validado
   (ese documento queda para validarse de nuevo) y 429 por demasiados intentos.
4. "Consultar estado" llama `POST /consulta`. Siempre responde lo mismo, y el estado llega sólo al correo registrado.

Reglas del alta que valida el navegador antes de enviar: el NIT va sin el DV, y el DV va en su propio campo y se comprueba con
el algoritmo de la DIAN. La cédula no lleva DV. Para el exterior, el tipo de sociedad es "No aplica". Para la persona
natural, el tipo y el tamaño de empresa son "Persona Natural". A crédito, el cupo es obligatorio. También es obligatorio
aceptar el tratamiento de datos. El campo oculto `sitioWeb` es una trampa para bots.

## Archivos

- `index.html`: el formulario y la consulta de estado.
- `js/config.js`: URL del backend y modo de subida.
- `js/main.js`: carga del catálogo, envío según el contrato y consulta de estado.
- `js/onchange.js`: qué se muestra según lo elegido y qué documentos pide cada caso.
- `js/validacionDocumentos.js`: límites de archivos y validación con IA (comprobantes).
- `js/validaciones.js`: validaciones del navegador (DV de la DIAN incluido).
- `js/formatos.js`: formato de moneda del cupo.
- `FormulasPowerAutomate.txt`: referencia histórica del flujo anterior; el formulario ya no lo usa.

## Pasar a producción

1. Despliega el backend con el endpoint `PUT /externo/registro-clientes/:numero/adjuntos/:adjuntoId/archivo`.
2. En el `.env` de producción del backend, define `REGISTRO_CLIENTES_SECRETO` (nuevo y distinto del de local) y agrega el
   dominio de Azure Static Web Apps de este sitio a `REGISTRO_CLIENTES_ORIGENES` y a `ALLOWED_ORIGINS`. Revisa también
   `S3_BUCKET_ADJUNTOS` y `S3_PREFIJO=prod`, y el texto legal en `REGISTRO_CLIENTES_TEXTO_AUTORIZACION`.
3. Cambia `API_BASE_URL` en `js/config.js` por la URL pública del backend y despliega. El push a `main` publica en Azure
   Static Web Apps.
4. Haz una prueba con datos sintéticos y apaga el flujo HTTP de Power Automate.
