/* ------------------------------------------------------------------------------------- */
/*                                 FUNCIONES ONCHAGE                                     */
/* ------------------------------------------------------------------------------------- */
/* Funciones Onchange para mostrar u ocultar campos según lo que elige el usuario.
   Las opciones y los documentos por caso vienen del catálogo (GET /formulario,
   ver main.js): aquí no hay listas quemadas. */

const PERSONA_NATURAL = "Persona Natural";
const NO_APLICA = "No aplica";
const CONSORCIO = "Consorcio";

function llenarSelect(select, opciones, textoVacio) {
  select.innerHTML = "";
  const vacia = document.createElement("option");
  vacia.value = "";
  vacia.textContent = textoVacio || "Selecciona una opción";
  vacia.disabled = true;
  // defaultSelected: así form.reset() vuelve a "Selecciona una opción".
  vacia.defaultSelected = true;
  vacia.selected = true;
  select.appendChild(vacia);
  opciones.forEach(function (opcion) {
    const o = document.createElement("option");
    o.value = typeof opcion === "string" ? opcion : opcion.id;
    o.textContent = typeof opcion === "string" ? opcion : opcion.nombre;
    select.appendChild(o);
  });
}

/*                   SELECCIONES DEPENDIENDO DEL TIPO DE IDENTIFICACION                  */

function tipoindentificacionOnchange(selected) {
  document.getElementById("cedula").style.display = selected.value == "CC" ? "" : "none";
  document.getElementById("nit").style.display = selected.value == "NIT" ? "" : "none";
  revalidarDocumentosConReferencia();
}

/*                   SELECCIONES DEPENDIENDO DEL TIPO DE CLIENTE                        */

function tipodeClienteOnchange(selected) {
  const exterior = selected.value == "Cliente Exterior";
  document.getElementById("clienteNacional").style.display = exterior ? "none" : "";
  document.getElementById("clienteExterior").style.display = exterior ? "" : "none";
  document.getElementById("tipo_sociedad").style.display = exterior ? "none" : "";

  // Para el exterior el tipo de sociedad es "No aplica"; para el nacional, nunca.
  const sociedades = catalogo.tiposSociedad.filter(function (s) {
    return exterior ? s === NO_APLICA : s !== NO_APLICA;
  });
  const sociedad = document.getElementById("t_sociedad");
  llenarSelect(sociedad, sociedades);
  if (exterior) sociedad.value = NO_APLICA;
  tipodeSociedadOnchange(sociedad);
}

/*                   SELECCIONES DEPENDIENDO DEL TIPO DE SOCIEDAD                       */

function tipodeSociedadOnchange(selected) {
  const personaNatural = selected.value == PERSONA_NATURAL;
  [
    ["t_empresa", catalogo.tiposEmpresa],
    ["tamano_empresa", catalogo.tamanosEmpresa],
  ].forEach(function (par) {
    const select = document.getElementById(par[0]);
    const anterior = select.value;
    // Persona natural: tipo y tamaño de empresa son "Persona Natural" y no se editan.
    llenarSelect(
      select,
      par[1].filter(function (o) {
        return personaNatural ? o === PERSONA_NATURAL : o !== PERSONA_NATURAL;
      }),
    );
    select.value = personaNatural ? PERSONA_NATURAL : anterior !== PERSONA_NATURAL ? anterior : "";
    if (!select.value) select.selectedIndex = 0;
    select.disabled = personaNatural;
  });
  actualizarDocumentos();
}

/*             CARGUE DE CONTACTOS DEPENDIENDO DE LA DIVISION SELECCIONADA              */

function divisionOnchange(selected) {
  const division = catalogo.divisiones.find(function (d) {
    return d.id === selected.value;
  });
  llenarSelect(document.getElementById("nombreContactoProgen"), division ? division.contactos : []);
}

/*                 CONDICIÓN DE PAGO: CUPO Y DOCUMENTOS DE CRÉDITO                      */

function condicionPagoOnchange() {
  const credito = condicionPagoElegida() === "Crédito";
  document.getElementById("cupo").style.display = credito ? "" : "none";
  if (!credito) document.getElementById("cupo_requerido").value = "";
  actualizarDocumentos();
}

function condicionPagoElegida() {
  const elegido = document.querySelector('input[name="requiere_cupo"]:checked');
  return elegido ? elegido.value : "";
}

/*        DOCUMENTOS REQUERIDOS U OPCIONALES SEGÚN documentosPorCaso DEL CATÁLOGO       */

/** El caso de documentosPorCaso que aplica a lo elegido, o null si falta elegir algo. */
function casoDocumentos() {
  const tipoCliente = document.getElementById("t_cliente").value;
  const tipoSociedad = document.getElementById("t_sociedad").value;
  const condicionPago = condicionPagoElegida();
  if (!tipoCliente || !tipoSociedad || !condicionPago) return null;
  const sociedad =
    tipoCliente === "Cliente Exterior"
      ? NO_APLICA
      : tipoSociedad === PERSONA_NATURAL || tipoSociedad === CONSORCIO
        ? tipoSociedad
        : "Otra";
  return (
    catalogo.documentosPorCaso.find(function (c) {
      return c.tipoCliente === tipoCliente && c.sociedad === sociedad && c.condicionPago === condicionPago;
    }) || null
  );
}

/** El documento del catálogo (copia_rut, ...) al que va un input de archivo. */
function documentoDeCampo(campo) {
  return catalogo.documentos.find(function (d) {
    return d.camposFormulario.indexOf(campo) >= 0;
  });
}

/** Contenedor de documentos del tipo de cliente elegido. */
function seccionDocumentos() {
  const exterior = document.getElementById("t_cliente").value === "Cliente Exterior";
  return document.getElementById(exterior ? "clienteExterior" : "clienteNacional");
}

function actualizarDocumentos() {
  const caso = casoDocumentos();
  const ayuda = document.getElementById("ayudaArchivos");
  ayuda.style.display = caso ? "none" : "";
  ayuda.textContent = "Elige el tipo de cliente, la sociedad y la condición de pago para ver los documentos que debes adjuntar.";

  document.querySelectorAll("#archivos .documento").forEach(function (fila) {
    const documento = documentoDeCampo(fila.dataset.campo);
    const requerido = !!caso && !!documento && caso.requeridos.indexOf(documento.id) >= 0;
    const opcional = !!caso && !!documento && caso.opcionales.indexOf(documento.id) >= 0;
    fila.style.display = requerido || opcional ? "" : "none";
    const input = fila.querySelector('input[type="file"]');
    input.required = requerido;
    const marca = fila.querySelector(".obligatoriedad");
    marca.textContent = requerido ? "(Obligatorio)" : "(Opcional)";
    marca.title = requerido ? "Obligatorio" : "Opcional";
    marca.style.color = requerido ? "blue" : "green";
  });
}

/** Inputs de archivo del caso actual (visibles), con su documento del catálogo. */
function documentosDelCaso() {
  const caso = casoDocumentos();
  if (!caso) return [];
  return Array.from(seccionDocumentos().querySelectorAll(".documento"))
    .filter(function (fila) {
      return fila.style.display !== "none";
    })
    .map(function (fila) {
      const documento = documentoDeCampo(fila.dataset.campo);
      return {
        input: fila.querySelector('input[type="file"]'),
        documento: documento,
        requerido: caso.requeridos.indexOf(documento.id) >= 0,
      };
    });
}
