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

function datosGrupos(claveMateria,claveGrupo,nombreMateria){
  this.claveMateria = claveMateria;
  this.claveGrupo = claveGrupo;
  this.nombreMateria = nombreMateria;
}
  var usuarioValida = require('electron').remote.getGlobal('informacion').token;
  var usuario = require('electron').remote.getGlobal('informacion').usuario;
  var periodo = require('electron').remote.getGlobal('informacion').periodo;



var materiaArray;

async function inicia(){
  var claveMateria="";
  var claveGrupo="";
  var nombreMateria="";
  var cantidadFaltas="";
  var a;
  var f;
  const grupos = await primerPromesa();

  grupos.shift();
  console.log(grupos)
  const faltasPromises = [];
  const asistenciasPromises = [];
  materiaArray = [];
  
  for (const grupo of grupos) {
    faltasPromises.push(contFaltas(grupo.clavemateria, grupo.materia, grupo.grupo));
    asistenciasPromises.push(contAsistencias(grupo.clavemateria, grupo.materia, grupo.grupo));
  }
  const faltas = await Promise.all(faltasPromises);
  const asistencias = await Promise.all(asistenciasPromises);
  

  for (let index = 0, length = grupos.length; index < length; index++) {
      const group = grupos[index];
      const { clavemateria, materia, grupo } = group;
      let resultado = "<li>" + clavemateria + '  ' + materia + '  ' + grupo + ' ' +' Faltas: '+ faltas[index] + ' ' +' Asistencias: '+ asistencias[index] + '<button id=' + index + '>Ver alumnos</button>';
     
      $("#lstGrupos").append(resultado);
      materiaArray.push(new datosGrupos(clavemateria,grupo,materia));

  }
}

/*
for (var i = 1; i < data.grupos.length; i++) {
    cveMateria = data.grupos[i].clavemateria;
    nombreMateria = data.grupos[i].materia;
    grupo = data.grupos[i].grupo;

    materias[i] = new info(cveMateria, nombreMateria, grupo);
   
    contFaltas(cveMateria,nombreMateria,grupo).then((data) => {
        f = "<li> FALTAS : "+data;
        $("#faltasAsistencias").append(f);
    }).catch((err) => {
        console.log(err);
    });

    contAsistencias(cveMateria,nombreMateria,grupo).then((data) => {
        a = "<li> FALTAS : "+data;
        $("#faltasAsistencias").append(a);
    }).catch((err) => {
        console.log(err);
    });
}
*/

function primerPromesa () {
  return new Promise((resolve, reject) => {
    $.ajax({
        url:'http://itculiacan.edu.mx/dadm/apipaselista/data/obtienegrupos2.php?usuario='+usuario+'&usuariovalida='+usuarioValida+'&periodoactual='+periodo,
        dataType: 'json',
        async: false,
         success: function (data) {
             if (data.respuesta) {
                 resolve(data.grupos);
             } else {
                 alert('Error');
             }
         }
     });
  });
}
function contFaltas (cveMateria,nombreMateria,grupo){

    return new Promise((resolve,reject) => {
        $.ajax({
            url: 'http://itculiacan.edu.mx/dadm/apipaselista/data/cantidadfaltasgrupo.php?usuario='+usuario+'&usuariovalida='+usuarioValida+'&periodoactual='+periodo+'&materia='+cveMateria+'&grupo='+grupo,
            dataType: 'json',
            success: function (data){
                if(data.respuesta){
                    resolve(data.cantidad);
                }else{
                    reject('error');
                }
            }
        });
        
    });
   

}

function  contAsistencias (cveMateria,nombreMateria,grupo){
    return new Promise((resolve,reject) => {
     $.ajax({
        url: 'http://itculiacan.edu.mx/dadm/apipaselista/data/cantidadasistenciasgrupo.php?usuario='+usuario+'&usuariovalida='+usuarioValida+'&periodoactual='+periodo+'&materia='+cveMateria+'&grupo='+grupo,
        dataType: 'json',
        success: function (data){
            if(data.respuesta){
                resolve(data.cantidad);
            }else{
                console.log("Sin Respuesta");
            }
           
        }
    });
});

}     

  let pantallaPase;

  function btnLista() {

    require('electron').remote.getGlobal('informacion').claveMateria = materiaArray[this.id].claveMateria;
    require('electron').remote.getGlobal('informacion').nombreMateria = materiaArray[this.id].nombreMateria;
    require('electron').remote.getGlobal('informacion').grupo = materiaArray[this.id].claveGrupo;

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
