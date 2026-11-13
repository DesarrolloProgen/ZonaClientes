/* ------------------------------------------------------------------------------------- */
/*                                       VALIDACIONES                                    */
/* ------------------------------------------------------------------------------------- */
/* Revisan en el navegador lo mismo que exige el backend, para avisar antes de
   enviar. El backend vuelve a validar todo y su `message` es el que manda. */

const PESOS_DV = [3, 7, 13, 17, 19, 23, 29, 37, 41, 43, 47, 53, 59, 67, 71];

/** Dígito de verificación de la DIAN para un NIT (sólo los dígitos, sin el DV). */
function calcularDV(nit) {
  const digitos = nit.replace(/\D/g, "").split("").reverse();
  const suma = digitos.reduce(function (total, d, i) {
    return total + Number(d) * (PESOS_DV[i] || 0);
  }, 0);
  const residuo = suma % 11;
  return residuo > 1 ? 11 - residuo : residuo;
}

function correoValido(correo) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo);
}

/** El primer problema de los datos del formulario, o null si están completos. */
function problemaEnDatos() {
  const valor = function (id) {
    return document.getElementById(id).value.trim();
  };

  if (!valor("nombreContacto")) return "Ingrese un nombre de contacto.";
  if (!/^\+?[\d\s()-]{7,20}$/.test(valor("telefonoContacto"))) return "Ingrese un teléfono de contacto válido.";
  if (!correoValido(valor("emailContacto"))) return "Ingrese un email de contacto válido.";
  if (!valor("division_comercial")) return "Seleccione la división comercial.";
  if (!valor("t_registro")) return "Seleccione el tipo de registro.";
  if (!valor("t_cliente")) return "Seleccione el tipo de cliente.";
  if (!valor("t_sociedad")) return "Debe seleccionar un tipo de sociedad.";
  if (!valor("t_empresa")) return "Seleccione el tipo de empresa.";
  if (!valor("tamano_empresa")) return "Seleccione el tamaño de la empresa.";

  const tipoIdentificacion = valor("t_identificacion");
  if (!tipoIdentificacion) return "Seleccione el tipo de identificación.";
  if (tipoIdentificacion === "CC" && !/^\d{5,20}$/.test(valor("cc").replace(/[.\s]/g, ""))) {
    return "Ingrese el número de cédula (sólo números).";
  }
  if (tipoIdentificacion === "NIT") {
    const nit = valor("numeroNIT").replace(/[.\s]/g, "");
    if (!/^\d{5,20}$/.test(nit)) return "Ingrese el NIT sin el dígito de verificación (sólo números).";
    if (!/^\d$/.test(valor("codigoNIT"))) return "Ingrese el dígito de verificación del NIT (un solo número).";
    if (String(calcularDV(nit)) !== valor("codigoNIT")) {
      return "El dígito de verificación no corresponde al NIT; revíselo.";
    }
  }

  if (!valor("nombreCliente")) return "Ingrese el nombre del cliente.";
  const condicionPago = condicionPagoElegida();
  if (!condicionPago) return "Seleccione la condición de pago.";
  if (condicionPago === "Crédito" && !(Number(valor("cupo_requerido").replace(/[$\s,]/g, "")) > 0)) {
    return "Ingrese el cupo de crédito solicitado.";
  }
  if (!valor("nombreContactoProgen")) return "Debe seleccionar una persona de contacto de PROGEN.";
  if (!document.getElementById("aceptaTratamientoDatos").checked) {
    return "Debe autorizar el tratamiento de sus datos personales.";
  }
  return null;
}

function validaciones() {
  if (!catalogo) {
    mostrarError("El formulario aún no carga. Recargue la página e intente de nuevo.");
    return false;
  }
  if (enviando) return false;

  const problema = problemaEnDatos();
  if (problema) {
    mostrarError(problema);
    return false;
  }

  /* Documentos obligatorios del caso (documentosPorCaso del catálogo) */
  const documentos = documentosDelCaso();
  const sinArchivo = documentos.filter(function (d) {
    return d.requerido && !(d.input.files && d.input.files[0]);
  });
  if (sinArchivo.length) {
    mostrarError(
      "Debe subir un archivo para los documentos obligatorios:",
      sinArchivo.map(function (d) {
        return d.documento.label;
      }),
    );
    return false;
  }

  /* Bloqueo por validación con IA pendiente o fallida (muestra el motivo) */
  const mensajeIA = validacionIAPendienteOFallida(documentos);
  if (mensajeIA) {
    mostrarError(mensajeIA);
    return false;
  }

  submitForm();
  return false;
}
