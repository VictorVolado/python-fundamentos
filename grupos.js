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
function info(cveMateria, nombreMateria, grupo) {
    this.cveMateria = cveMateria;
    this.nombreMateria = nombreMateria;
    this.grupo = grupo;
}

function datosGrupos(claveMateria,claveGrupo,nombreMateria){
  this.claveMateria = claveMateria;
  this.claveGrupo = claveGrupo;
  this.nombreMateria = nombreMateria;
}
  var usuarioValida = require('electron').remote.getGlobal('informacion').token;
  var usuario = require('electron').remote.getGlobal('informacion').usuario;
  var periodo = require('electron').remote.getGlobal('informacion').periodo;


var materias;

function inicia(){
  
  var claveMateria="";
  var claveGrupo="";
  var nombreMateria="";
  var cantidadFaltas="";
  var a;

  $.ajax({
       url:'http://itculiacan.edu.mx/dadm/apipaselista/data/obtienegrupos2.php?usuario='+usuario+'&usuariovalida='+usuarioValida+'&periodoactual='+periodo,
       dataType: 'json',
       async: false,
        success: function (data) {

            if (data.respuesta) {
                console.log(data)
                var resultado = '';
                materias = new Array(data.grupos[0].cantidad);

                for (var i = 1; i < data.grupos.length; i++) {
                    cveMateria = data.grupos[i].clavemateria;
                    nombreMateria = data.grupos[i].materia;
                    grupo = data.grupos[i].grupo;

                    materias[i] = new info(cveMateria, nombreMateria, grupo);
                    resultado = "<li>" + cveMateria + '  ' + nombreMateria + '  ' + grupo + '<button id=' + i + '>Ver alumnos</button>';
                    
                    $("#lstGrupos").append(resultado);
                    contFaltas(cveMateria,nombreMateria,grupo).then((data) => {
                        a = data;
                        console.log(a);
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            } else {
                alert('Error');
            }
        }
    });  
     console.log(materias[1].grupo);


}
function contFaltas (cveMateria,nombreMateria,grupo){

    return new Promise((resolve,reject) => {
        var cantidadFaltas;
        $.ajax({
            url: 'http://itculiacan.edu.mx/dadm/apipaselista/data/cantidadfaltasgrupo.php?usuario='+usuario+'&usuariovalida='+usuarioValida+'&periodoactual='+periodo+'&materia='+cveMateria+'&grupo='+grupo,
            dataType: 'json',
            success: function (data){
                if(data.respuesta){
                    cantidadFaltas = data.cantidad;
                    resolve(cantidadFaltas);
                }else{
                    reject('error');
                }
            }
        });
        
    });
   

}

function  contAsistencias (cveMateria,nombreMateria,grupo){
  
     $.ajax({
        url: 'http://itculiacan.edu.mx/dadm/apipaselista/data/cantidadasistenciasgrupo.php?usuario='+usuario+'&usuariovalida='+usuarioValida+'&periodoactual='+periodo+'&materia='+cveMateria+'&grupo='+grupo,
        dataType: 'json',
        success: function (data){
            if(data.respuesta){
                var i;
                i++;
                var faltas = 0;
                cantidadAsistencias = data.cantidad;
                return cantidadAsistencias;
            }else{
                console.log("Sin Respuesta");
            }
           
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

    //pantallaDetalle.webContents.openDevTools();
    pantallaPase.show();
}

$("body").on("click", "li > button", btnLista);
inicia();
