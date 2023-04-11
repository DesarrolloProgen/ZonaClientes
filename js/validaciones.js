/* ------------------------------------------------------------------------------------- */
/*                                       VARIABLES                                       */
/* ------------------------------------------------------------------------------------- */

    var nombreContacto = document.getElementById("nombreContacto");
    var telefonoContacto = document.getElementById("telefonoContacto");
    var emailContacto = document.getElementById("emailContacto");
    var tipo_registro = document.getElementById("t_registro");
    var tipo_cliente = document.getElementById("t_cliente");
    var tipo_identificacion = document.getElementById("t_identificacion");
    var cedula = document.getElementById("cc");
    var numeroNIT =document.getElementById("numeroNIT");
    var codigoNIT =document.getElementById("codigoNIT");
    var nit;
    var nombre_cliente = document.getElementById("nombreCliente");
    var requiere_cupo;
    var requiere_cupo_si = document.getElementById("requiere_cupo_si");
    var requiere_cupo_no = document.getElementById("requiere_cupo_no");
    var cupo_requerido = document.getElementById("cupo_requerido");
    var division_comercial = document.getElementById("division_comercial");
    var tipo_sociedad = document.getElementById("t_sociedad");
    var tipo_empresa = document.getElementById("t_empresa");
    var tamano_empresa = document.getElementById("tamano_empresa");
    var nombre_contactoProgen = document.getElementById("nombreContactoProgen");
    var email_contactoProgen =document.getElementById("emailContactoProgen");
    var clienteNacional = [];
    var clienteExterior = [];
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
    const exterior = {
      FormularioExterior: "Formulario Exterior",
      copiacedulaExt: "Copia de Cedula",
      registroTributario: "Registro Tributario",
      CertificadoExistencia: "Certificado de Existencia",
      certificacionesBASC: "Certificado BASC",
      estadofinanExt:"Estados Financieros"
    }


/* ------------------------------------------------------------------------------------- */
/*                                       VALIDACIONES                                    */
/* ------------------------------------------------------------------------------------- */
    function validar_email( email ){
        var regex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return regex.test(email) ? true : false;
    }

    function validaciones() {

        /* Nombre de Contacto */

        if(nombreContacto.value == null || nombreContacto.value == ""){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar un nombre de contacto';
            return false;
        }

        /* Telefono de Contacto */

        if(telefonoContacto.value == null || telefonoContacto.value == "" || isNaN(parseInt(telefonoContacto.value))){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar un telefono de contacto';
            return false;
        }

        /* Email de Contacto */

        if(emailContacto.value == null || emailContacto.value == "" || validar_email(emailContacto.value) == false){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar un email de contacto';
            return false;
        }

        /* Division Comercial */
        
        if(division_comercial.value == null || division_comercial.value == "" || division_comercial.value == "Selecciona una opción"){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Seleccione una división comercial';
            return false;
        }

        /* Tipo de Registro */

        if(tipo_registro.value == "" || tipo_registro.value == "Selecciona una opción" || tipo_registro.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de Registro';
            return false;
        }

        /* Tipo de Cliente */
        
        if (tipo_cliente.value == "Selecciona una opción" || tipo_cliente.value =="") {
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Seleccione el tipo de Cliente';
            $(".custom-file-label").addClass("selected").html("Choose File");
            return false;
        }


        /* Tipo de Empresa */

        if(tipo_empresa.value == "" || tipo_empresa.value == "Selecciona una opción" || tipo_empresa.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de empresa';
            return false;
        }

        /* Tamaño de la Empresa */

        if(tamano_empresa.value == "" || tamano_empresa.value == "Selecciona una opción" || tamano_empresa.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar el tamaño de la empresa';
            return false;
        }

        /* Tipo de Indentificacion */

        if(tipo_identificacion.value == "" || tipo_identificacion.value == "Selecciona una opción" || tipo_identificacion.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de identificación';
            return false;
        }

        /* Cedula en tipo de identificación */

        if(tipo_identificacion.value == "CC" && (cedula.value == "" || cedula.value == null || isNaN(parseInt(cedula.value)))){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Ingrese su número de cédula';
            return false;
        }

        /* NIT para identicacion */

        if(tipo_identificacion.value == "NIT" && (numeroNIT.value == null || numeroNIT.value == "" || isNaN(parseInt(numeroNIT.value)))){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar su numero de NIT (Solo se aceptan números)';
            return false;
        }

        /* Codigo de Verificación del NIT */

        if(tipo_identificacion.value == "NIT" && (codigoNIT.value == null || codigoNIT.value == "" || isNaN(parseInt(codigoNIT.value)))){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar su codigo de verificación del NIT (Solo se aceptan números)';
            return false;
        }

        /* Nombre del Cliente */

        if(nombre_cliente.value == "" || nombre_cliente.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Ingrese el nombre del cliente';
            return false;
        }

        /* Condición de Pago */

        if(!document.querySelector('input[name="requiere_cupo"]:checked')) {
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Seleccione si necesita cupo de credito.';
            return false;
        }

        /* Nombre de contacto de Progen*/

        if(nombre_contactoProgen.value == "" || nombre_contactoProgen.value == null || nombre_contactoProgen.value == "Selecciona una opción"){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar una persona de contacto ';
            return false;
        }
        
        /*Obtener Check del Radio Button*/

        if(requiere_cupo_si.checked){
            requiere_cupo = requiere_cupo_si.value;
        }
    
        if(requiere_cupo_no.checked){
            requiere_cupo = requiere_cupo_no.value;
        }
/* ------------------------------------------------------------------------------------- */
/*                             VALIDACIONES DEPENDIENTES                                 */
/* ------------------------------------------------------------------------------------- */
/*         Validaciones de Datos adicionales en caso de Tipo Cliente = Cliente Nacional  */

        if(tipo_cliente.value == "Cliente Nacional"){
            /* Validacion de Tipo de Sociedad */
          let obligatoriosNacional = document.querySelectorAll("#clienteNacional input[required]");
            if(tipo_sociedad.value == "" || tipo_sociedad.value == "Selecciona una opción" || tipo_sociedad.value == null){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de sociedad';
              return false;
            }

            /* Validaciones de las imagenes Obligatorias para cliente Nacional */
            console.log(obligatoriosNacional)
            for (let i = 0; i < obligatoriosNacional.length; i++) {
              if(!(clienteNacional.find((archivo) => archivo.archivo === nacional[obligatoriosNacional[i].name]))){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo para el documento ' + nacional[obligatoriosNacional[i].name];
                return false;  
              }
            }
          }

/*     Validaciones de Datos adicionales en caso de Tipo Cliente = Cliente Exterior  */

        if(tipo_cliente.value == "Cliente Exterior"){
          let obligatoriosExterior = document.querySelectorAll("#clienteExterior input[required]");
          console.log(obligatoriosExterior)
          for (let i = 0; i < obligatoriosExterior.length; i++) {
            if(!(clienteExterior.find((archivo) => archivo.archivo === exterior[obligatoriosExterior[i].name]))){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe subir un archivo para el documento ' + exterior[obligatoriosExterior[i].name];
              return false;  
            }
          }
        }
        
        submitForm();
    }