const $ = require('jquery')
const {BrowserWindow} = require('electron').remote
app = require('electron').app
path = require('path')
url = require('url')
//constantes para pdf
const ipc = require('electron').ipcRenderer
const botonPDF = document.getElementById('btnPDF')
//activar elemento click del btnPDF
botonPDF.addEventListener('click',function(event){

    botonPDF.style.display ="none"
    ipc.send('print-to-pdf')

});

var usuarioValida = require('electron').remote.getGlobal('informacion').token;
var usuario = require('electron').remote.getGlobal('informacion').usuario;
var periodo = require('electron').remote.getGlobal('informacion').periodo;

var materias = new Array(10);

function info(cveMateria, nombreMateria, grupos) {
    this.cveMateria = cveMateria;
    this.nombreMateria = nombreMateria;
    this.grupo = grupo;
}

function inicia(){
 
  var claveMateria="";
  var claveGrupo="";
  var nombreMateria="";
  var cantidadFaltas="";
  var resultado = '';

  $.ajax({
       url:'http://itculiacan.edu.mx/dadm/apipaselista/data/obtienegrupos2.php?usuario='+usuario+'&usuariovalida='+usuarioValida+'&periodoactual='+periodo,
       dataType: 'json',
        success: function (data) {

            if (data.respuesta) {
                for (var i = 1; i < data.grupos.length; i++) {
                    cveMateria = data.grupos[i].clavemateria;
                    nombreMateria = data.grupos[i].materia;
                    grupo = data.grupos[i].grupo;
                    contFaltas(cveMateria,nombreMateria,grupo);
                    
;                   resultado = "<li>" + cveMateria + '  ' + nombreMateria + '  ' + grupo + '<button id=' + i + '>Ver alumnos</button>';
                    $("#lstGrupos").append(resultado);
                }
            } else {
                alert('Error');
            }
        }
    });
    
}

function contFaltas (cveMateria,nombreMateria,grupo){

    $.ajax({
        url: 'http://itculiacan.edu.mx/dadm/apipaselista/data/cantidadfaltasgrupo.php?usuario='+usuario+'&usuariovalida='+usuarioValida+'&periodoactual='+periodo+'&materia='+cveMateria+'&grupo='+grupo,
        dataType: 'json',
        success: function (data){
            if(data.respuesta){
                cantidadFaltas = data.cantidad;
            }else{
                console.log("Sin Respuesta");
            }
            return cantidadFaltas;
        }
    });
}

function  contAsistencias (cveMateria,nombreMateria,grupo){
  
     $.ajax({
        url: 'http://itculiacan.edu.mx/dadm/apipaselista/data/cantidadasistenciasgrupo.php?usuario='+usuario+'&usuariovalida='+usuarioValida+'&periodoactual='+periodo+'&materia='+cveMateria+'&grupo='+grupo,
        dataType: 'json',
        success: function (data){
            if(data.respuesta){
                var faltas = 0;
                cantidadAsistencias = data.cantidad;
            }else{
                console.log("Sin Respuesta");
            }
            return cantidadAsistencias;
        }
    });

}
   


  let pantallaPase;

  function btnLista() {

    require('electron').remote.getGlobal('informacion').claveMateria = materias[this.id].cveMateria;
    require('electron').remote.getGlobal('informacion').nombreMateria = materias[this.id].nombreMateria;
    require('electron').remote.getGlobal('informacion').grupo = materias[this.id].grupo;

    pantallaPase = new BrowserWindow({ width: 700, height: 600 });
    pantallaPase.loadURL(url.format({
        pathname: path.join(__dirname, 'listaAlum.html'),
        protocol: 'file',
        slashes: true
    }));

    pantallaPase.show();
}

$("body").on("click", "li > button", btnLista);
inicia();
