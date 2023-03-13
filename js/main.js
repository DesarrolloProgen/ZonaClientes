window.addEventListener('load', function () {

      const form = document.forms[0];
      var now = new Date();
      var fecha = now.getDate() + '-' + (now.getMonth() + 1) + '-' + now.getFullYear();
      var minutos = now.getMinutes()
      if(minutos<10) minutos="0"+minutos;
      var hora = now.getHours() + ':' + minutos;
      var fechayHora = fecha + ' ' + hora;
      const url = "https://prod-15.brazilsouth.logic.azure.com:443/workflows/6f5adc4b19ea4a0797c6b583454f89e4/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=ycWNhrXZBjyyHIJ13E1FI3SAnoewf_XNRO_MYCNH13k";
      var data = {};
/*-------------------------------------------------------------------------------------------- */
/*                                  Configurar la Petición                                     */
/*-------------------------------------------------------------------------------------------- */    
      form.addEventListener('submit', function (event) {
            event.preventDefault();
            console.log(validaciones());
            if (!validaciones()) return false;
            nit = numeroNIT.value + " - " + codigoNIT.value
            if (tipo_identificacion.value == "CC"){
                  data = {
                        fecha: fechayHora,
                        tipo_registro: tipo_registro.value,
                        tipo_cliente: tipo_cliente.value,
                        tipo_sociedad: tipo_sociedad.value,
                        tipo_identificacion: tipo_identificacion.value,
                        cedula: cedula.value,
                        nombre_cliente: nombre_cliente.value,
                        requiere_cupo: requiere_cupo,
                        cupo_requerido: cupo_requerido.value,
                        division_comercial: division_comercial.value,
                        nombre_contactoProgen: nombre_contactoProgen.value,
                        email_contactoProgen: email_contactoProgen.value,
                        clienteNacional: clienteNacional,
                        clienteExterior: clienteExterior,
                        tipo_empresa: tipo_empresa.value,
                        tamano_empresa: tamano_empresa.value,
                        nombreContacto: nombreContacto.value,
                        telefonoContacto: telefonoContacto.value,
                        emailContacto: emailContacto.value
                  }
            }
            if (tipo_identificacion.value == "NIT"){
                  data = {
                        fecha: fechayHora,
                        tipo_registro: tipo_registro.value,
                        tipo_cliente: tipo_cliente.value,
                        tipo_sociedad: tipo_sociedad.value,
                        tipo_identificacion: tipo_identificacion.value,
                        nit: nit,
                        nombre_cliente: nombre_cliente.value,
                        requiere_cupo: requiere_cupo,
                        cupo_requerido: cupo_requerido.value,
                        division_comercial: division_comercial.value,
                        nombre_contactoProgen: nombre_contactoProgen.value,
                        email_contactoProgen: email_contactoProgen.value,
                        clienteNacional: clienteNacional,
                        clienteExterior: clienteExterior,
                        tipo_empresa: tipo_empresa.value,
                        tamano_empresa: tamano_empresa.value,
                        nombreContacto: nombreContacto.value,
                        telefonoContacto: telefonoContacto.value,
                        emailContacto: emailContacto.value
                  }
            }

            console.log("Se creo el data ");
            const settings = {
                  method: 'POST',
                  body: JSON.stringify(data),
                  headers: {
                      'Content-Type': 'application/json'
                  }
            }
            
            console.log(data);
            cargando();
            enviarPeticion(settings);
      });

    /*-------------------------------------------------------------------------------------------- */
    /*                                       Enviar Peticion                                       */
    /*-------------------------------------------------------------------------------------------- */

      function enviarPeticion(settings) {
            fetch(url, settings)
            .then(response => {
                  console.log(response);
                  document.getElementById("headermensaje").style.background = '#6EF05F';
                  document.getElementById('titulomensaje').innerHTML='Realizado';
                  document.getElementById('mensaje').innerHTML='Se realizó correctamente su registro.';  
                  document.getElementById("formulario").reset();
                  $(".custom-file-label").addClass("selected").html("Choose File");
                  clienteNacional = {};
                  clienteExterior = {};
                  document.getElementById("cedula").style.display = "none";
                  document.getElementById("nit").style.display = "none";
                  document.getElementById("clienteNacional").style.display = "none";
                  document.getElementById("clienteExterior").style.display = "none";
                  document.getElementById("camaraycomercio").style.display = "none";
                  document.getElementById("actaconsorcial").style.display = "none";
                  $("#cupo").css("display", "none");
                  return response.json
                  
              })
              .catch(err => {
                  console.log("Promesa Rechazada");
                  console.log(err);
                  document.getElementById("headermensaje").style.background = '#ff3c37';
                  document.getElementById('titulomensaje').innerHTML='ERROR';
                  document.getElementById('mensaje').innerHTML='Algo salio mal.... Recargue la pagina e intete nuevamente, Si esto no funciona comuniquese con el administrador<br>' + err;
              })
      }

      function cargando() {
            document.getElementById("headermensaje").style.background = '#4040ff';
            document.getElementById('titulomensaje').innerHTML='Cargando';
            document.getElementById('mensaje').innerHTML='<img src="https://acegif.com/wp-content/uploads/loading-25.gif" alt="Cargando" width="50px" height="50px"><span style="padding-left: 10px">Cargando...</span>';
      }
})
    /*-------------------------------------------------------------------------------------------- */
    /*                                  Funciones Adicionales                                      */
    /*-------------------------------------------------------------------------------------------- */

    /*--------------------------------  Guardar Archivo en Array  ---------------------------------*/

    function saveFileClienteNacional(f) {
      const nacional = {
        FormularioNacional: "Formulario Nacional",
        copiacedula: "Copia de Cedula",
        copiaRut: "Copia Rut",
        camaracomercio: "Camara y Comercio",
        actaConsorcial: "Acta Consorcial",
        certificacionesBASC: "Certificaciones",
        estadofinan: "Estados Financieros",
        renta: "Declaracion de Renta",
        referenciaComercial: "Referencia Comercial",
        referenciaBancaria: "Referencia Bancaria"
      }
      const file = f.files[0];
      const fr = new FileReader();
      fr.addEventListener("load", function () {
        let contenido = fr.result.split(",");
        const obj = {
          archivo: nacional[f.name],
          filename: file.name,
          mimeType: file.type,
          contenido: {
            "$content-type" : file.type,
            "$content" : contenido[1]
          }
        };
        clienteNacional.push(obj)
      });

      if (file) {
        fr.readAsDataURL(file);
      }
      console.log(clienteNacional);
    }

    function saveFileClienteExterior(f) {
      const exterior = {
        FormularioExterior: "Formulario Exterior",
        copiacedula: "Copia de Cedula",
        registroTributario: "Registro Tributario",
        CertificadoExistencia: "Certificado de Existencia",
        certificacionesBASC: "Certificado BASC",
        estadofinan:"Estados Financieros"
      }
      const file = f.files[0];
      const fr = new FileReader();
      fr.addEventListener("load", function () {
        let contenido = fr.result.split(",");
        const obj = {
          archivo: exterior[f.name],
          filename: file.name,
          mimeType: file.type,
          contenido: {
            "$content-type" : file.type,
            "$content" : contenido[1]
          }
        };
        clienteExterior.push(obj)
      });

      if (file) {
        fr.readAsDataURL(file);
      }
      console.log(clienteExterior);
    }


    /*--------------------------------  Nombre al cargar archivo  ---------------------------------*/
    $(".custom-file-input").on("change", function () {
      var fileName = $(this).val().split("\\").pop();
      $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });