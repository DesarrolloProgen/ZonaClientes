/* ------------------------------------------------------------------------------------- */
/*                                 FUNCIONES ONCHAGE                                     */
/* ------------------------------------------------------------------------------------- */
/* Funciones Onchange para las condiciones de mostrar diferentes 
                                     DIV dependiendo de selecciones por parte del usuario*/

/*                   SELECCIONES DEPENDIENDO DEL TIPO DE IDENTIFICACION                  */

function tipoindentificacionOnchange(selected) {
  divCC = document.getElementById("cedula");
  divNIT = document.getElementById("nit");

  if (selected.value == "CC") {
    divCC.style.display = "";
    divNIT.style.display = "none";
  } else if (selected.value == "NIT") {
    divCC.style.display = "none";
    divNIT.style.display = "";
  }
}

/*                   SELECCIONES DEPENDIENDO DEL TIPO DE CLIENTE                        */

function tipodeClienteOnchange(selected) {
  divNacional = document.getElementById("clienteNacional");
  divExterior = document.getElementById("clienteExterior");
  divSociedad = document.getElementById("tipo_sociedad");
  if (selected.value == "Cliente Nacional") {
    divNacional.style.display = "";
    divExterior.style.display = "none";
    document.getElementsByName("FormularioNacional")[0].required = true;
    document.getElementsByName("copiacedula")[0].required = true;
    document.getElementsByName("FormularioExterior")[0].required = false;
    document.getElementsByName("copiacedulaExt")[0].required = false;
    document.getElementsByName("registroTributario")[0].required = false;
    document.getElementsByName("CertificadoExistencia")[0].required = false;
    divSociedad.style.display = "";
  } else if (selected.value == "Cliente Exterior") {
    divNacional.style.display = "none";
    divExterior.style.display = "";
    divSociedad.style.display = "none";
    document.getElementsByName("FormularioNacional")[0].required = false;
    document.getElementsByName("copiacedula")[0].required = false;
    document.getElementsByName("FormularioExterior")[0].required = true;
    document.getElementsByName("copiacedulaExt")[0].required = true;
    document.getElementsByName("registroTributario")[0].required = true;
    document.getElementsByName("CertificadoExistencia")[0].required = true;
  }
}

/*                   SELECCIONES DEPENDIENDO DEL TIPO DE SOCIEDAD                       */

function tipodeSociedadOnchange(selected) {
  divCamara = document.getElementById("camaraycomercio");
  divConsorcio = document.getElementById("actaconsorcial");

  if (selected.value == "Consorcio") {
    divCamara.style.display = "none";
    divConsorcio.style.display = "";
    document.getElementsByName("copiaRut")[0].required = true;
    document.getElementsByName("camaracomercio")[0].required = false;
    document.getElementsByName("actaConsorcial")[0].required = true;
  } else {
    divCamara.style.display = "";
    divConsorcio.style.display = "none";
    document.getElementsByName("copiaRut")[0].required = true;
    document.getElementsByName("camaracomercio")[0].required = true;
    document.getElementsByName("actaConsorcial")[0].required = false;
  }

  if (selected.value == "Persona Natural") {
    $("#t_empresa").prop("disabled", true);
    $("#tamano_empresa").prop("disabled", true);
    var opt = document.createElement("option");
    opt.value = "Persona Natural";
    opt.innerHTML = "Persona Natural";
    opt.selected = "true";
    var opt1 = document.createElement("option");
    opt1.value = "Persona Natural";
    opt1.innerHTML = "Persona Natural";
    opt1.selected = "true";
    document.getElementById("t_empresa").appendChild(opt);
    document.getElementById("tamano_empresa").appendChild(opt1);
    $("#rutobligatorio").prop("style", "color:green");
    $("#camaraobligatoria").prop("style", "color:green");
    document.getElementById("rutobligatorio").innerHTML = "(Opcional)";
    document.getElementById("camaraobligatoria").innerHTML = "(Opcional)";
    document.getElementsByName("copiaRut")[0].required = false;
    document.getElementsByName("camaracomercio")[0].required = false;
  } else {
    $("#t_empresa").prop("disabled", false);
    $("#tamano_empresa").prop("disabled", false);
    $("#t_empresa").val("Selecciona una opción");
    $("#tamano_empresa").val("Selecciona una opción");
    $("#t_empresa option[value='Persona Natural']").remove();
    $("#tamano_empresa option[value='Persona Natural']").remove();
    $("#rutobligatorio").prop("style", "color:blue");
    $("#camaraobligatoria").prop("style", "color:blue");
    document.getElementById("rutobligatorio").innerHTML = "(Obligatorio)";
    document.getElementById("camaraobligatoria").innerHTML = "(Obligatorio)";
  }
}

/*             CARGUE DE CONTACTOS DEPENDIENDO DE LA DIVISION SELECCIONADA              */

function divisionOnchange(selected) {
  var listContacto = "<option disabled selected>Selecciona una opción</option>";
  document.getElementById("fila_credito").style.display = "";

  if (selected.value == "Envases Plásticos") {
    listContacto +=
      "<option value='Patricia Carbonell'>Patricia Carbonell</option>";
  }

  if (selected.value == "Exportaciones") {
    listContacto +=
      "<option value='Jonathan Barreto'>Jonathan Barreto</option>";
    listContacto += "<option value='Gilberto Osorio'>Gilberto Osorio</option>";
  }

  if (selected.value == "Instrumentación") {
    listContacto += "<option value='Karen Algutria'>Karen Algutria</option>";
    listContacto += "<option value='Juan Rolon'>Juan Rolón</option>";
    listContacto += "<option value='Fernando Ayala'>Fernando Ayala</option>";
    listContacto += "<option value='Diego Martinez'>Diego Martinez/option>";
    document.getElementById("fila_credito").style.display = "";
  }

  if (selected.value == "Laboratorio Metrología") {
    listContacto += "<option value='Fredy Silva'>Fredy Silva</option>";
    var cupo = document.getElementById("requiere_cupo_no");
    document.getElementById("fila_credito").style.display = "none";
    cupo.checked = true;
  }

  if (selected.value == "RoyalCondor") {
    listContacto += "<option value='Carola Perdomo'>Carola Perdomo</option>";
    listContacto += "<option value='Daniel Mora'>Daniel Mora</option>";
    listContacto += "<option value='David Galeano'>David Galeano</option>";
    listContacto += "<option value='Diego Ramirez'>Diego Ramirez</option>";
    listContacto += "<option value='Eduardo Novoa'>Eduardo Novoa</option>";
    listContacto += "<option value='Ever Mendoza'>Ever Mendoza</option>";
    listContacto += "<option value='Fredy Rubiano'>Fredy Rubiano</option>";
    listContacto += "<option value='Jerson Camargo'>Jerson Camargo</option>";
    listContacto +=
      "<option value='Jose Ricardo Sarmiento'>Jose Ricardo Sarmiento</option>";
    listContacto += "<option value='Mauricio Posada'>Mauricio Posada</option>";
    listContacto += "<option value='Nidia Ramirez'>Nidia Ramirez</option>";
    listContacto += "<option value='Pilar Hernandez'>Pilar Hernandez</option>";
    listContacto += "<option value='Ricardo Arias'>Ricardo Arias</option>";
    listContacto += "<option value='Wilmar Buitrago'>Wilmar Buitrago</option>";
  }

  if (selected.value == "Señalización") {
    listContacto +=
      "<option value='María Nelly Betancourt'>María Nelly Betancourt</option>";
    listContacto +=
      "<option value='Ayda Patricia Rivera'>Ayda Patricia Rivera</option>";
  }

  if (selected.value == "Viruta - Retail") {
    listContacto += "<option value='Patricia Jara'>Patricia Jara</option>";
  }
  $("#nombreContactoProgen").html(listContacto);
}

/*            CAMBIAR CORREO DE CONTACTO DEPENDIENDO DEL CONTACTO PROGEN ESCOGIDO        */

function nombreContactoOnchange(selected) {
  if (selected.value == "Jose Ricardo Sarmiento") {
    var correo = "rc.limpiezaydesinfeccion@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Jonathan Barreto") {
    var correo = "jonathan.barreto@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Gilberto Osorio") {
    var correo = "gilberto.osorio@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Pilar Hernandez") {
    var correo = "pilar.hernandez@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Patricia Carbonell") {
    var correo = "patricia.carbonell@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Carola Perdomo") {
    var correo = "carola.perdomo@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Daniel Mora") {
    var correo = "daniel.mora@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "David Galeano") {
    var correo = "david.galeano@royalcondor.com ";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Karen Algutria") {
    var correo = "karen.algutria@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Juan Rolon") {
    var correo = "juan.rolon@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Fernando Ayala") {
    var correo = "fernando.ayala@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Diego Martinez") {
    var correo = "instrumentacion.comercial2@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Fredy Silva") {
    var correo = "fredy.silva@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Diego Ramirez") {
    var correo = "diego.ramirez@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Eduardo Novoa") {
    var correo = "eduardo.novoa@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Ever Mendoza") {
    var correo = "ever.mendoza@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Fredy Rubiano") {
    var correo = "fredy.rubiano@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Jerson Camargo") {
    var correo = "jerson.camargo@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Mauricio Posada") {
    var correo = "mauricio.posada@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Nidia Ramirez") {
    var correo = "nidia.ramirez@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Ricardo Arias") {
    var correo = "ricardo.arias@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Wilmar Buitrago") {
    var correo = "wilmar.buitrago@royalcondor.com";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Daniel Soler") {
    var correo = "daniel.soler@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "María Nelly Betancourt") {
    var correo = "maria.betancourt@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Ayda Patricia Rivera") {
    var correo = "patricia.rivera@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }

  if (selected.value == "Patricia Jara") {
    var correo = "patricia.jara@progen.com.co";
    $("#emailContactoProgen").val(correo);
  }
}
/*          DOCUMENTO REQUERIDO PARA EL CREDITO NACIONAL Y EXTERIOR            */

function handleClick(selected) {
  var divCRN = document.getElementById("credito_requerido_nacional");
  var divCRE = document.getElementById("credito_requerido_exterior");
  var tipo_cliente = document.getElementById("t_cliente");
  var tipo_empresa = document.getElementById("t_empresa");
  if (selected.value == "Crédito" && tipo_cliente.value == "Cliente Nacional") {
    divCRN.style.display = "";
    divCRE.style.display = "none";
    document.getElementsByName("estadofinan")[0].required = true;
    document.getElementsByName("renta")[0].required = true;
    document.getElementsByName("referenciaComercial")[0].required = true;
    document.getElementsByName("referenciaBancaria")[0].required = true;
  }
  if (selected.value == "Contado" && tipo_cliente.value == "Cliente Nacional") {
    divCRN.style.display = "none";
    divCRE.style.display = "none";
    document.getElementsByName("estadofinan")[0].required = false;
    document.getElementsByName("renta")[0].required = false;
    document.getElementsByName("referenciaComercial")[0].required = false;
    document.getElementsByName("referenciaBancaria")[0].required = false;
  }
  if (selected.value == "Crédito" && tipo_cliente.value == "Cliente Exterior") {
    divCRN.style.display = "none";
    divCRE.style.display = "";
    document.getElementsByName("estadofinanExt")[0].required = true;
  }
  if (selected.value == "Contado" && tipo_cliente.value == "Cliente Exterior") {
    divCRN.style.display = "none";
    divCRE.style.display = "none";
    document.getElementsByName("estadofinanExt")[0].required = false;
  }
  if (
    selected.value == "Crédito" &&
    tipo_cliente.value == "Cliente Nacional" &&
    tipo_empresa.value == "Persona Natural"
  ) {
    divCRN.style.display = "";
    divCRE.style.display = "none";
    $("#rutobligatorio").prop("style", "color:blue");
    $("#camaraobligatoria").prop("style", "color:blue");
    document.getElementById("rutobligatorio").innerHTML = "(Obligatorio)";
    document.getElementById("camaraobligatoria").innerHTML = "(Obligatorio)";
    document.getElementsByName("copiaRut")[0].required = true;
    document.getElementsByName("camaracomercio")[0].required = true;
  }
  if (
    selected.value == "Contado" &&
    tipo_cliente.value == "Cliente Nacional" &&
    tipo_empresa.value == "Persona Natural"
  ) {
    divCRN.style.display = "none";
    divCRE.style.display = "none";
    $("#rutobligatorio").prop("style", "color:green");
    $("#camaraobligatoria").prop("style", "color:green");
    document.getElementById("rutobligatorio").innerHTML = "(Opcional)";
    document.getElementById("camaraobligatoria").innerHTML = "(Opcional)";
    document.getElementsByName("copiaRut")[0].required = false;
    document.getElementsByName("camaracomercio")[0].required = false;
  }
}
