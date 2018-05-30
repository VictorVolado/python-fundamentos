const $ = require('jquery'),
    { BrowserWindow } = require('electron').remote,
    app = require('electron').app,
    path = require('path'),
    url = require('url'),
    ipc = require('electron').ipcRenderer
    btnPDF = document.getElementById('botonPDF');
    //activar elemento click del btnPDF
    botonPDF.addEventListener('click',function(event){

    botonPDF.style.display ="none"
    ipc.send('print-to-pdf')

});

    let pantallaDetalle;

var alumnos,
    token = '',
    usuario = '',
    periodo = '',
    materia = '',
    nombreMateria = '',
    grupo = '',
    numcontrol = '';

function inicia() {

  	    token = require('electron').remote.getGlobal('informacion').token,
        usuario = require('electron').remote.getGlobal('informacion').usuario,
        periodo = require('electron').remote.getGlobal('informacion').periodo,
        materia = require('electron').remote.getGlobal('informacion').clave,
        nombreMateria = require('electron').remote.getGlobal('informacion').nombreMateria,
        grupo = require('electron').remote.getGlobal('informacion').grupo;
      
        console.log(token,usuario,periodo,materia,nombreMateria,grupo);
   

    $("#titulo").append('<br>' + materia + ' ' + nombreMateria);

  
    $.ajax({
        url:'http://itculiacan.edu.mx/dadm/apipaselista/data/obtienealumnos2.php?usuario=' + usuario + '&usuariovalida=' + token + '&periodoactual=' + periodo + '&materia=' + materia + '&grupo=' + grupo,
        dataType: 'json',
        success: function (data) {
            
            
            if (data.respuesta) {
                var resultado = '',
                    nombre = '',
                    apellidopaterno = '',
                    apellidomaterno = '',
                    nombrecompleto,
                    t;
                    
                alumnos = new Array(t);

                for (var i = 1; i < data.alumnos.length; i++) {
                    t++;
                    numcontrol = data.alumnos[i].ncontrol;
                    nombre = data.alumnos[i].nombre;
                    apellidopaterno = data.alumnos[i].apellidopaterno;
                    apellidomaterno = data.alumnos[i].apellidomaterno;
                    nombrecompleto = nombre + ' ' + apellidopaterno + ' ' + apellidomaterno;
                    alumnos[i] = numcontrol;
                    resultado = "<li>" + numcontrol + ' ' + nombrecompleto + '<button onclick=clickaction(b) name=' + i + ' id=Falta' + i + ' class="falta">Falta</button>' + '<button onclick=clickaction(b) name = ' + i + ' id=Asistencia' + i + ' class="asistencia">Asistencia</button>';
                    $("#lstAlumnos").append(resultado);
                }
            } else {
                alert('Error');
            }
        }
    })

}

function onclickaction(b){

       

    var incidenciaMandar=(b.target.id.charAt(0));
    if(incidenciaMandar==="A"){
        var numIdAdesaparecer=(b.target.id.charAt(10));
    var idADesaparecer="Falta"+numIdAdesaparecer;
   
    document.getElementById(idADesaparecer).style.visibility = 'hidden';
        incidenciaMandar=1;
    }else{
        var numIdAdesaparecer=(b.target.id.charAt(5));
        var idADesaparecer="Asistencia"+numIdAdesaparecer;
        
        document.getElementById(idADesaparecer).style.visibility = 'hidden';
        incidenciaMandar=2;
    }
  

    $.ajax({
        url:'http://itculiacan.edu.mx/dadm/apipaselista/data/asignaincidencia.php?usuario='+usuario+'&usuariovalida='+token+'&periodoactual='+periodo+'&materia='+materia+'&grupo='+grupo+'&ncontrol='+alumnos[b.target.name]+'&incidencia='+incidenciaMandar,
        dataType: 'json',
        success: function (data) {
            if (data.respuesta) {
                   
            } else {
                alert('Error al poner asistencia');
            }
        }
    });
}

var regresar = function () {
    var window = require('electron').remote.getCurrentWindow();
    window.close();
}

$("#btnRegresar").on("click", regresar)


$("body").on("click","li > button",onclickaction);
inicia();