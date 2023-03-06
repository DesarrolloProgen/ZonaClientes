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
    var nit = numeroNIT.value + "-" +codigoNIT.value;
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

        if(nombre_contactoProgen.value == "" || nombre_contactoProgen.value == null){
            document.getElementById("headermensaje").style.background = '#ff3c37';
            document.getElementById('titulomensaje').innerHTML='ERROR';
            document.getElementById('mensaje').innerHTML='Debe ingresar una persona de contacto ';
            return false;
        }

        /* Email Contacto de Progen */

        if(email_contactoProgen.value == "" || email_contactoProgen.value == null || validar_email(email_contactoProgen.value) == false){
          document.getElementById("headermensaje").style.background = '#ff3c37';
          document.getElementById('titulomensaje').innerHTML='ERROR';
          document.getElementById('mensaje').innerHTML='Debe ingresar el correo de la persona de contacto';
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

            if(tipo_sociedad.value == "" || tipo_sociedad.value == "Selecciona una opción" || tipo_sociedad.value == null){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe seleccionar un tipo de sociedad';
              return false;
            }

            /* Validaciones de las imagenes Obligatorias para cliente Nacional */
    
            if(clienteNacional[0] == null){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe subir un archivo para el Formato de registro de Clientes';
              return false;
            }
    
            if(clienteNacional[1] == null){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe subir un archivo para la cedula del representante legal';
              return false;
            }
    
            if(clienteNacional[2] == null && tipo_sociedad.value != "Persona Natural"){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe subir un archivo para el RUT de su empresa';
              return false;
            }
    
            if(clienteNacional[3] == null && tipo_sociedad.value != "Persona Natural"){
              document.getElementById("headermensaje").style.background = '#ff3c37';
              document.getElementById('titulomensaje').innerHTML='ERROR';
              document.getElementById('mensaje').innerHTML='Debe subir un archivo de certificado de camara y comercio o acta Consorcial';
              return false;
            }

            /* Validacion de adjuntos requeridos adicionales en caso de requerir CUPO de Credito */
            if(requiere_cupo_si.checked){
    
              if(clienteNacional[2] == null && tipo_sociedad.value == "Persona Natural"){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo para el RUT de su empresa';
                return false;
              }
    
              if(clienteNacional[3] == null && tipo_sociedad.value == "Persona Natural"){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo de certificado de camara y comercio o acta Consorcial';
                return false;
              }
    
              if(clienteNacional[4] == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo de estados financieros comparativos a los últimos 2 años';
                return false;
              }
    
              if(clienteNacional[5] == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo de declaración de renta del año anterior';
                return false;
              }
    
              if(clienteNacional[6] == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo de referencia comercial del año en curso';
                return false;
              }
    
              if(clienteNacional[7] == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo de referencia bancaria del año en curso';
                return false;
              }
            }
          }

/*     Validaciones de Datos adicionales en caso de Tipo Cliente = Cliente Exterior  */

        if(tipo_cliente.value == "Cliente Exterior"){
            if(clienteExterior[0] == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo para el formulario de registro de Clientes';
                return false;
            }
            if(clienteExterior[1] == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo para la cédula de ciudadania del representante legal';
                return false;
            }
            if(clienteExterior[2] == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo de la copia del RUT de su empresa';
                return false;
            }
            if(clienteExterior[3] == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo del certificado de existencia y representación legal';
                return false;
            }
            if(requiere_cupo_si.checked){
            if(clienteExterior[5] == null){
                document.getElementById("headermensaje").style.background = '#ff3c37';
                document.getElementById('titulomensaje').innerHTML='ERROR';
                document.getElementById('mensaje').innerHTML='Debe subir un archivo de los estados financieros comparativos de los últimos 2 años a 31 de Dic';
                return false;
            }
            }      
        }
        
        return true;

    }