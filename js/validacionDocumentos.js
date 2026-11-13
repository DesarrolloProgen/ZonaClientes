/* ------------------------------------------------------------------------------------- */
/*                  VALIDACIÓN DE DOCUMENTOS CON IA (backend Portal PROGEN)              */
/* ------------------------------------------------------------------------------------- */
/*
  Cada documento cuyo tipo en el catálogo tiene `tipoValidacion` se manda a
  POST /validacion-documentos (URL en config.js) apenas se elige el archivo.
  Si la IA lo aprueba, guarda el `comprobante`: sin él el backend no deja
  subir ese archivo. Mientras un documento esté pendiente o rechazado, el
  envío queda bloqueado (ver validaciones.js) y se muestra el `motivo`.
*/

/*
  Estado por input de archivo (clave: id del input):
  { archivo, estado: 'pendiente' | 'valido' | 'rechazado' | 'esperandoDatos' | 'listo',
    motivo, comprobante, referencia, subido: { archivo, adjuntoId } }
  'listo' es un archivo sin validación con IA que ya pasó tamaño y tipo.
*/
const estadoArchivos = {};

/* Contador por input para descartar respuestas de validaciones viejas. */
const intentoValidacion = {};

function numeroIdentificacion() {
  const tipo = document.getElementById("t_identificacion").value;
  const campo = tipo === "NIT" ? "numeroNIT" : tipo === "CC" ? "cc" : null;
  return campo ? document.getElementById(campo).value.replace(/\D/g, "") : "";
}

/** Lo que la API exige comparar: el NIT para el RUT y la cédula si el cliente es persona con CC. */
function datosReferencia(documento) {
  if (documento.tipoValidacion === "rut") return { nit: numeroIdentificacion() };
  if (documento.id === "copia_cedula" && document.getElementById("t_identificacion").value === "CC") {
    return { numeroDocumento: numeroIdentificacion() };
  }
  return {};
}

function faltaReferencia(referencia) {
  return Object.keys(referencia).some(function (campo) {
    return !referencia[campo];
  });
}

function pintarEstado(input, mensaje, clase) {
  const contenedor = input.closest(".documento").lastElementChild;
  contenedor.textContent = mensaje;
  contenedor.className = "col-md-8 small " + (clase || "");
}

function archivoABase64(file) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onload = () => resolve(fr.result.split(",")[1]);
    fr.onerror = reject;
    fr.readAsDataURL(file);
  });
}

/** Revisa tamaño y tipo con los límites del catálogo; devuelve el motivo o null. */
function motivoArchivoNoPermitido(documento, file) {
  const limites = catalogo.adjuntos;
  if (file.size === 0) return "El archivo está vacío.";
  if (file.size > limites.tamanoMaximoBytes) {
    return "El archivo supera el máximo de " + Math.round(limites.tamanoMaximoBytes / 1048576) + " MB.";
  }
  if (documento.tipoValidacion) {
    if (limites.tiposParaValidacion.indexOf(file.type) < 0)
      return "Este documento se sube sólo en PDF o imagen (PNG, JPG o WEBP).";
  } else if (limites.tiposPermitidos.indexOf(file.type) < 0) {
    return "Sólo se permiten PDF, imágenes y documentos de Word o Excel.";
  }
  return null;
}

async function validarDocumentoConIA(input, documento, file) {
  const estado = estadoArchivos[input.id];
  const intento = (intentoValidacion[input.id] || 0) + 1;
  intentoValidacion[input.id] = intento;
  const referencia = datosReferencia(documento);
  estado.referencia = JSON.stringify(referencia);
  estado.comprobante = null;

  if (faltaReferencia(referencia)) {
    estado.estado = "esperandoDatos";
    estado.motivo = "Escribe el número de identificación del cliente para verificar este documento.";
    pintarEstado(input, estado.motivo, "text-warning");
    return;
  }

  estado.estado = "pendiente";
  estado.motivo = null;
  pintarEstado(input, "Verificando documento con IA...", "text-primary");

  try {
    const contenido = await archivoABase64(file);
    const respuesta = await fetch(VALIDACION_API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipoDocumento: documento.tipoValidacion,
        archivo: { filename: file.name, mimeType: file.type, contenido: contenido },
        datosReferencia: referencia,
      }),
    });
    const resultado = await respuesta.json().catch(() => ({}));
    if (intentoValidacion[input.id] !== intento) return;

    if (!respuesta.ok) {
      estado.estado = "rechazado";
      estado.motivo = resultado.message || "No se pudo validar el documento. Intenta de nuevo.";
    } else if (resultado.valido && resultado.comprobante) {
      estado.estado = "valido";
      estado.comprobante = resultado.comprobante;
    } else {
      estado.estado = "rechazado";
      estado.motivo = resultado.motivo || "El documento no pasó la validación.";
    }
    pintarEstado(
      input,
      estado.estado === "valido" ? "✔ Documento válido." : "✘ " + estado.motivo,
      estado.estado === "valido" ? "text-success" : "text-danger",
    );
  } catch (error) {
    if (intentoValidacion[input.id] !== intento) return;
    estado.estado = "rechazado";
    estado.motivo = "No se pudo contactar el servicio de validación. Vuelve a elegir el archivo para intentarlo de nuevo.";
    pintarEstado(input, estado.motivo, "text-danger");
    console.error("Error validando documento con IA:", error);
  }
}

/** Cambia el texto de la etiqueta del archivo sin perder la marca (Obligatorio)/(Opcional). */
function ponerEtiqueta(etiqueta, texto) {
  const marca = etiqueta.querySelector(".obligatoriedad");
  etiqueta.textContent = texto + " ";
  if (marca) etiqueta.appendChild(marca);
}

function archivoElegido(input) {
  const file = input.files && input.files[0];
  const etiqueta = input.parentElement.querySelector(".custom-file-label");
  if (!file) {
    delete estadoArchivos[input.id];
    ponerEtiqueta(etiqueta, etiqueta.dataset.original);
    pintarEstado(input, "", "");
    return;
  }
  ponerEtiqueta(etiqueta, file.name);

  const documento = documentoDeCampo(input.name);
  const anterior = estadoArchivos[input.id];
  // Conserva lo ya subido a este borrador para reemplazarlo en vez de duplicarlo.
  estadoArchivos[input.id] = { archivo: file, subido: anterior ? anterior.subido : null };

  const motivo = motivoArchivoNoPermitido(documento, file);
  if (motivo) {
    estadoArchivos[input.id].estado = "rechazado";
    estadoArchivos[input.id].motivo = motivo;
    pintarEstado(input, "✘ " + motivo, "text-danger");
    return;
  }
  if (!documento.tipoValidacion) {
    estadoArchivos[input.id].estado = "listo";
    pintarEstado(input, "", "");
    return;
  }
  validarDocumentoConIA(input, documento, file);
}

/**
 * Si cambia el tipo o el número de identificación, el RUT y la cédula ya
 * validados quedan con otro número: se vuelven a validar con el nuevo.
 */
function revalidarDocumentosConReferencia() {
  document.querySelectorAll('#archivos input[type="file"]').forEach(function (input) {
    const estado = estadoArchivos[input.id];
    if (!estado || !estado.referencia) return;
    const documento = documentoDeCampo(input.name);
    if (JSON.stringify(datosReferencia(documento)) !== estado.referencia) {
      validarDocumentoConIA(input, documento, estado.archivo);
    }
  });
}

/** El backend rechazó el comprobante o el archivo: hay que volver a validarlo. */
function invalidarDocumento(input, motivo) {
  const estado = estadoArchivos[input.id];
  if (!estado) return;
  estado.estado = "rechazado";
  estado.motivo = motivo;
  estado.comprobante = null;
  pintarEstado(input, "✘ " + motivo + " Vuelve a elegir el archivo.", "text-danger");
}

function configurarInputsDeArchivo() {
  document.querySelectorAll('#archivos input[type="file"]').forEach(function (input) {
    const documento = documentoDeCampo(input.name);
    const etiqueta = input.parentElement.querySelector(".custom-file-label");
    etiqueta.dataset.original = etiqueta.firstChild.textContent.trim();
    input.accept = (
      documento && documento.tipoValidacion ? catalogo.adjuntos.tiposParaValidacion : catalogo.adjuntos.tiposPermitidos
    ).join(",");
    input.addEventListener("change", function () {
      archivoElegido(this);
    });
  });
  ["cc", "numeroNIT"].forEach(function (id) {
    document.getElementById(id).addEventListener("change", revalidarDocumentosConReferencia);
  });
}

/**
 * Consultada por validaciones.js antes de permitir el envío: devuelve el
 * mensaje que bloquea el envío, o null si todos los archivos elegidos están
 * listos (validados por la IA cuando les aplica).
 */
function validacionIAPendienteOFallida(documentos) {
  for (const d of documentos) {
    const estado = estadoArchivos[d.input.id];
    if (!estado) continue;
    if (estado.estado === "pendiente") {
      return "Espera a que termine de verificarse el documento «" + d.documento.label + "».";
    }
    if (estado.estado === "esperandoDatos" || estado.estado === "rechazado") {
      return "El documento «" + d.documento.label + "» no pasó la validación: " + estado.motivo;
    }
  }
  return null;
}
