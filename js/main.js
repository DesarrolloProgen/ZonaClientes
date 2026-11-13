/* ------------------------------------------------------------------------------------- */
/*                 REGISTRO DE CLIENTES CONTRA EL BACKEND (Portal PROGEN)                */
/* ------------------------------------------------------------------------------------- */
/*
  Contrato: portal-progen-backend/docs/registro-clientes-api.md
  GET /formulario → (validación con IA por documento) → POST / → por archivo:
  POST /:numero/adjuntos → subida → POST .../confirmar → POST /:numero/enviar.
*/

/* Catálogo de GET /formulario: listas, divisiones, documentos y límites. */
let catalogo = null;
let tokenFormulario = null;
let tokenFormularioEn = 0;

/* Borrador creado en este envío ({ numero, token, datos }), para reintentar sin duplicarlo. */
let envio = null;
let enviando = false;

/* El token del formulario dura 4 h; se renueva antes de que venza. */
const RENOVAR_TOKEN_MS = 3.5 * 60 * 60 * 1000;

class ErrorApi extends Error {
  constructor(status, mensaje, detalles) {
    super(mensaje);
    this.status = status;
    this.detalles = detalles;
  }
}

/** Llama la API de registro. `registro: true` agrega X-Registro-Token; `archivo` va como cuerpo crudo. */
async function llamarApi(ruta, opciones) {
  opciones = opciones || {};
  const headers = {};
  let body;
  if (opciones.archivo) {
    headers["Content-Type"] = opciones.archivo.type;
    body = opciones.archivo;
  } else if (opciones.body) {
    headers["Content-Type"] = "application/json";
    body = JSON.stringify(opciones.body);
  }
  if (opciones.registro) headers["X-Registro-Token"] = envio.token;

  let respuesta;
  try {
    respuesta = await fetch(REGISTRO_API_URL + ruta, { method: opciones.method || "GET", headers: headers, body: body });
  } catch (error) {
    throw new ErrorApi(0, "No se pudo conectar con el servidor. Revisa tu conexión e intenta de nuevo.");
  }
  const datos = respuesta.status === 204 ? {} : await respuesta.json().catch(() => ({}));
  if (!respuesta.ok) {
    throw new ErrorApi(
      respuesta.status,
      datos.message || "Algo salió mal (" + respuesta.status + "). Intenta de nuevo.",
      datos.details,
    );
  }
  return datos;
}

/* ------------------------------  Catálogo del formulario  ----------------------------- */

async function cargarCatalogo() {
  try {
    catalogo = await llamarApi("/formulario");
  } catch (error) {
    const aviso = document.getElementById("errorCatalogo");
    aviso.textContent = "No se pudo cargar el formulario: " + error.message;
    aviso.style.display = "";
    return;
  }
  tokenFormulario = catalogo.token;
  tokenFormularioEn = Date.now();

  llenarSelect(document.getElementById("division_comercial"), catalogo.divisiones);
  llenarSelect(document.getElementById("t_registro"), catalogo.tiposRegistro);
  llenarSelect(document.getElementById("t_cliente"), catalogo.tiposCliente);
  llenarSelect(document.getElementById("t_identificacion"), catalogo.tiposIdentificacion);
  llenarSelect(document.getElementById("consultaTipoIdentificacion"), catalogo.tiposIdentificacion);
  llenarSelect(document.getElementById("t_sociedad"), []);
  tipodeSociedadOnchange(document.getElementById("t_sociedad"));

  const condiciones = document.getElementById("condicionesPago");
  condiciones.innerHTML = "";
  catalogo.condicionesPago.forEach(function (condicion, i) {
    const id = "condicionPago" + i;
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.className = "cupo";
    radio.id = id;
    radio.name = "requiere_cupo";
    radio.value = condicion;
    radio.style.marginLeft = i > 0 ? "25px" : "";
    radio.addEventListener("change", condicionPagoOnchange);
    const etiqueta = document.createElement("label");
    etiqueta.htmlFor = id;
    etiqueta.className = "col-form-label";
    etiqueta.style.paddingLeft = "4px";
    etiqueta.textContent = condicion;
    condiciones.append(radio, etiqueta);
  });

  let texto = catalogo.autorizacionDatos && catalogo.autorizacionDatos.texto;
  if (!texto) {
    // Temporal mientras el backend no tenga REGISTRO_CLIENTES_TEXTO_AUTORIZACION.
    texto = "Autorizo a PROGEN a tratar mis datos personales para gestionar esta solicitud de registro como cliente.";
    console.warn("autorizacionDatos.texto llegó vacío; se usa un texto temporal.");
  }
  document.getElementById("textoAutorizacion").textContent = texto;

  configurarInputsDeArchivo();
  actualizarDocumentos();
  document.getElementById("boton").disabled = false;
  document.getElementById("botonConsulta").disabled = false;
}

/** Un token del formulario crea un solo registro: para otro registro se pide uno nuevo. */
async function renovarToken() {
  const nuevo = await llamarApi("/formulario");
  tokenFormulario = nuevo.token;
  tokenFormularioEn = Date.now();
}

/* -------------------------------------  Mensajes  ------------------------------------- */

function mostrarMensaje(tipo, titulo, texto, lista) {
  const colores = { error: "#ff3c37", exito: "#6EF05F", cargando: "#4040ff" };
  document.getElementById("headermensaje").style.background = colores[tipo];
  document.getElementById("titulomensaje").textContent = titulo;
  const cuerpo = document.getElementById("mensaje");
  cuerpo.innerHTML = "";
  if (tipo === "cargando") {
    const img = document.createElement("img");
    img.src = "https://acegif.com/wp-content/uploads/loading-25.gif";
    img.alt = "Cargando";
    img.width = 50;
    img.height = 50;
    cuerpo.appendChild(img);
  }
  const parrafo = document.createElement("span");
  parrafo.style.paddingLeft = tipo === "cargando" ? "10px" : "";
  parrafo.textContent = texto;
  cuerpo.appendChild(parrafo);
  if (lista && lista.length) {
    const ul = document.createElement("ul");
    lista.forEach(function (item) {
      const li = document.createElement("li");
      li.textContent = item;
      ul.appendChild(li);
    });
    cuerpo.appendChild(ul);
  }
}

function mostrarError(texto, lista) {
  mostrarMensaje("error", "ERROR", texto, lista);
}

/* ------------------------------------  Envío  --------------------------------------- */

function datosRegistro() {
  const tipoIdentificacion = document.getElementById("t_identificacion").value;
  const condicionPago = condicionPagoElegida();
  const datos = {
    token: tokenFormulario,
    sitioWeb: document.getElementById("sitioWeb").value,
    aceptaTratamientoDatos: document.getElementById("aceptaTratamientoDatos").checked,
    tipoRegistro: document.getElementById("t_registro").value,
    tipoCliente: document.getElementById("t_cliente").value,
    tipoSociedad: document.getElementById("t_sociedad").value,
    tipoEmpresa: document.getElementById("t_empresa").value,
    tamanoEmpresa: document.getElementById("tamano_empresa").value,
    nombre: document.getElementById("nombreCliente").value.trim(),
    tipoIdentificacion: tipoIdentificacion,
    numeroIdentificacion: numeroIdentificacion(),
    contactoNombre: document.getElementById("nombreContacto").value.trim(),
    contactoTelefono: document.getElementById("telefonoContacto").value.trim(),
    contactoCorreo: document.getElementById("emailContacto").value.trim(),
    condicionPago: condicionPago,
    divisionId: document.getElementById("division_comercial").value,
    contactoComercialId: document.getElementById("nombreContactoProgen").value,
  };
  if (tipoIdentificacion === "NIT") datos.digitoVerificacion = document.getElementById("codigoNIT").value.trim();
  if (condicionPago === "Crédito") datos.cupoRequerido = document.getElementById("cupo_requerido").value;
  return datos;
}

/** Crea el borrador, o reusa el de un intento anterior si los datos no cambiaron. */
async function crearBorrador() {
  const datos = datosRegistro();
  const huella = JSON.stringify(Object.assign({}, datos, { token: null }));
  if (envio && envio.datos === huella) return;
  if (envio || Date.now() - tokenFormularioEn > RENOVAR_TOKEN_MS) {
    // Cambiaron los datos tras un intento fallido: es otro registro. El borrador anterior lo borra el backend.
    await renovarToken();
    datos.token = tokenFormulario;
    Object.keys(estadoArchivos).forEach(function (id) {
      estadoArchivos[id].subido = null;
    });
  }
  const r = await llamarApi("/", { method: "POST", body: datos });
  envio = { numero: r.numero, token: r.token, datos: huella };
}

/** Pide la subida, sube el archivo (al backend o directo a S3) y la confirma. */
async function subirDocumento(d) {
  const estado = estadoArchivos[d.input.id];
  const file = d.input.files[0];
  if (estado.subido && estado.subido.archivo === file) return;

  const pedido = { categoria: d.documento.id, nombre: file.name, tipoContenido: file.type, tamano: file.size };
  if (d.documento.tipoValidacion) pedido.comprobante = estado.comprobante;
  if (estado.subido) pedido.reemplazaId = estado.subido.adjuntoId;

  const ruta = "/" + envio.numero + "/adjuntos";
  const subida = await llamarApi(ruta, { method: "POST", body: pedido, registro: true });
  if (SUBIDA_POR_BACKEND) {
    await llamarApi(ruta + "/" + subida.adjuntoId + "/archivo", { method: "PUT", archivo: file, registro: true });
  } else {
    let respuesta;
    try {
      respuesta = await fetch(subida.url, { method: subida.metodo, headers: subida.encabezados, body: file });
    } catch (error) {
      respuesta = null;
    }
    if (!respuesta || !respuesta.ok)
      throw new ErrorApi(respuesta ? respuesta.status : 0, "No se pudo subir el archivo. Intenta de nuevo.");
  }
  await llamarApi(ruta + "/" + subida.adjuntoId + "/confirmar", { method: "POST", registro: true });
  estado.subido = { archivo: file, adjuntoId: subida.adjuntoId };
}

async function submitForm() {
  if (enviando) return;
  enviando = true;
  let documentoActual = null;
  try {
    mostrarMensaje("cargando", "Cargando", "Creando la solicitud...");
    await crearBorrador();

    const documentos = documentosDelCaso().filter(function (d) {
      return d.input.files && d.input.files[0];
    });
    for (let i = 0; i < documentos.length; i++) {
      documentoActual = documentos[i];
      mostrarMensaje("cargando", "Cargando", "Subiendo documentos (" + (i + 1) + " de " + documentos.length + ")...");
      await subirDocumento(documentoActual);
    }
    documentoActual = null;

    mostrarMensaje("cargando", "Cargando", "Enviando la solicitud...");
    const enviado = await llamarApi("/" + envio.numero + "/enviar", { method: "POST", registro: true });
    mostrarMensaje(
      "exito",
      "Realizado",
      "Recibimos tu solicitud " +
        enviado.numero +
        " (" +
        enviado.estadoEtiqueta +
        "). Te enviamos la confirmación al correo de contacto.",
    );
    await reiniciarFormulario();
  } catch (error) {
    manejarErrorEnvio(error, documentoActual);
  } finally {
    enviando = false;
  }
}

function manejarErrorEnvio(error, documentoActual) {
  console.error("Error en el envío del registro:", error);
  const detalles = error.detalles || {};

  // El token del registro venció o el borrador ya no existe: el próximo intento crea otro.
  if (error.status === 404) envio = null;

  // Documentos faltantes: el mensaje ya los nombra; se listan también aparte.
  if (error.status === 409 && Array.isArray(detalles.faltantes)) {
    const nombres = detalles.faltantes.map(function (id) {
      const documento = catalogo.documentos.find(function (d) {
        return d.id === id;
      });
      return documento ? documento.label : id;
    });
    mostrarError(error.message, nombres);
    return;
  }

  // Comprobante inválido o archivo distinto al validado: ese documento debe validarse otra vez.
  if (error.status === 400 && documentoActual) {
    invalidarDocumento(documentoActual.input, error.message);
    mostrarError("Documento «" + documentoActual.documento.label + "»: " + error.message);
    return;
  }

  mostrarError(error.message);
}

async function reiniciarFormulario() {
  document.getElementById("formulario").reset();
  Object.keys(estadoArchivos).forEach(function (id) {
    const input = document.getElementById(id);
    delete estadoArchivos[id];
    archivoElegido(input);
  });
  envio = null;
  ["clienteNacional", "clienteExterior", "tipo_sociedad", "cedula", "nit", "cupo"].forEach(function (id) {
    document.getElementById(id).style.display = "none";
  });
  llenarSelect(document.getElementById("nombreContactoProgen"), [], "Primero elige la división comercial");
  tipodeSociedadOnchange(document.getElementById("t_sociedad"));
  try {
    await renovarToken();
  } catch (error) {
    console.error("No se pudo renovar el token del formulario:", error);
  }
}

/* -------------------------------  Consulta de estado  --------------------------------- */

async function consultarEstado() {
  const resultado = document.getElementById("resultadoConsulta");
  const datos = {
    token: tokenFormulario,
    sitioWeb: document.getElementById("sitioWeb").value,
    tipoIdentificacion: document.getElementById("consultaTipoIdentificacion").value,
    numeroIdentificacion: document.getElementById("consultaNumero").value.trim(),
    correo: document.getElementById("consultaCorreo").value.trim(),
  };
  if (!datos.tipoIdentificacion || !datos.numeroIdentificacion || !correoValido(datos.correo)) {
    resultado.className = "small mt-2 text-danger";
    resultado.textContent = "Elige el tipo de identificación y escribe el número y el correo registrado.";
    return;
  }
  const boton = document.getElementById("botonConsulta");
  boton.disabled = true;
  try {
    if (Date.now() - tokenFormularioEn > RENOVAR_TOKEN_MS) await renovarToken();
    const r = await llamarApi("/consulta", { method: "POST", body: datos });
    resultado.className = "small mt-2 text-success";
    resultado.textContent = r.mensaje;
  } catch (error) {
    resultado.className = "small mt-2 text-danger";
    resultado.textContent = error.message;
  } finally {
    boton.disabled = false;
  }
}

document.addEventListener("DOMContentLoaded", cargarCatalogo);
