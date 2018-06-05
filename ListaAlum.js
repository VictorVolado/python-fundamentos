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
    function datosAlumnos(ncontrol,nombre,apellidopaterno,apellidomaterno){
    this.ncontrol = ncontrol;
    this.nombre = nombre;
    this.apellidomaterno = apellidomaterno;
    this.apellidopaterno = apellidopaterno;
    }

var token = '',
    usuario = '',
    periodo = '',
    materia = '',
    nombreMateria = '',
    grupo = '',
    numcontrol = '';
    var alumnosArray;

async function inicia() {

    token = require('electron').remote.getGlobal('informacion').token,
    usuario = require('electron').remote.getGlobal('informacion').usuario,
    periodo = require('electron').remote.getGlobal('informacion').periodo,
    materia = require('electron').remote.getGlobal('informacion').claveMateria,
    nombreMateria = require('electron').remote.getGlobal('informacion').nombreMateria,
    grupo = require('electron').remote.getGlobal('informacion').grupo;   

    $("#titulo").append('<br>' + materia + ' ' + nombreMateria);
   
    const alumnos = await primerPromesa();
    alumnos.shift();
    const faltasPromises = [];
    const asistenciasPromises = [];
    alumnosArray = [];
    
    for (const alumno of alumnos) {
      faltasPromises.push(contFaltas(materia, nombreMateria,grupo, alumno.ncontrol));
      asistenciasPromises.push(contAsistencias(materia,nombreMateria,grupo,alumno.ncontrol));

    }



    const faltas = await Promise.all(faltasPromises);
    const asistencias = await Promise.all(asistenciasPromises);

    for (let index = 0, length = alumnos.length; index < length; index++) {
        const alum = alumnos[index];
        const { ncontrol, nombre, apellidopaterno,apellidomaterno } = alum;
        var nombrecompleto = nombre + ' ' + apellidopaterno + ' ' + apellidomaterno;

        let resultado = "<li>"+ nombrecompleto+" "+ncontrol+" Faltas :"+faltas[index]+" Asistencias :"+asistencias[index]+'<button onclick=clickaction(b) name=' +index+ ' id=Falta' + index + ' class="falta">Falta</button>' + '<button onclick=clickaction(b) name = ' + index + ' id=Asistencia' + index + ' class="asistencia">Asistencia</button>';
        $("#lstAlumnos").append(resultado);

        alumnosArray.push(new datosAlumnos(ncontrol,nombre,apellidopaterno,apellidomaterno));
       

    }

    for (alumno of alumnos){
        await reporteAlumnoAsistencias(periodo,alumno.ncontrol,nombrecompleto, materia, grupo, alumno.asistencias);
        await reporteAlumnoFaltas(periodo,alumno.ncontrol,nombrecompleto, materia, grupo, alumno.faltas);

    }

}

function primerPromesa () {
        return new Promise((resolve, reject) => {
    $.ajax({
        url:'http://itculiacan.edu.mx/dadm/apipaselista/data/obtienealumnos2.php?usuario=' + usuario + '&usuariovalida=' + token + '&periodoactual=' + periodo + '&materia=' + materia + '&grupo=' + grupo,
        dataType: 'json',
        success: function (data) {
            if(data.respuesta){
                resolve(data.alumnos)
            }else{
                console.log("error")
            }

        }
    });
});
}

function contFaltas (cveMateria,nombreMateria,grupo,ncontrol){

    return new Promise((resolve,reject) => {
        $.ajax({
            url: 'http://itculiacan.edu.mx/dadm/apipaselista/data/cantidadfaltasalumno.php?usuario='+usuario+'&usuariovalida='+token+'&periodoactual='+periodo+'&materia='+materia+'&grupo='+grupo + "&ncontrol="+ncontrol,
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

function  contAsistencias (cveMateria,nombreMateria,grupo,ncontrol){
    return new Promise((resolve,reject) => {
     $.ajax({
        url: 'http://itculiacan.edu.mx/dadm/apipaselista/data/cantidadasistenciasalumno.php?usuario='+usuario+'&usuariovalida='+token+'&periodoactual='+periodo+'&materia='+materia+'&grupo='+grupo + "&ncontrol="+ncontrol,
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


function onclickaction(b){

    var p1 =b.target.id.charAt(10);
    var p2 =b.target.id.charAt(11);
    var f = p1.concat(p2);
    var f2 = b.target.id.charAt(5).concat(b.target.id.charAt(6))
    console.log(f);

    var incidenciaMandar=(b.target.id.charAt(0));
    if(incidenciaMandar==="A"){
        var numIdAdesaparecer=(b.target.id.charAt(10));
    var idADesaparecer="Falta"+f;
   
    document.getElementById(idADesaparecer).style.visibility = 'hidden';
        incidenciaMandar=1;
    }else{
        var numIdAdesaparecer=(b.target.id.charAt(5));
        var idADesaparecer="Asistencia"+f2;
        
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

function reporteAlumnoAsistencias (periodo, numcontrol, nombre, materia, grupo, asistencias) {
    return new Promise((resolve, reject) => {

        var datos = "opc=alumnoFaltas" +"&periodo=" + periodo +"&ncontrol=" + numcontrol + "&nombre=" + nombre +"&materia=" + materia +"&grupo=" + grupo +"&asistencias=" + faltas +"&aleatorio=" + Math.random();


        $.ajax({
            
            type: "POST",
            dataType: "json",
            url: "php/alumnosasistencias.php",
            data: datos,
            success: function (resolve) {
                result(resolve)
            },
            error: function (xhr, ajaxOptions, thrown) {
                console.log(xhr + ajaxOptions + thrown);
                reject('Error')
            }
        })
    })  
}
function reporteAlumnoFaltas (periodo, numcontrol, nombre, materia, grupo, asistencias) {
    return new Promise((resolve, reject) => {

        var datos = "opc=alumnoFaltas" +"&periodo=" + periodo +"&ncontrol=" + numcontrol + "&nombre=" + nombre +"&materia=" + materia +"&grupo=" + grupo +"&asistencias=" + faltas +"&aleatorio=" + Math.random();

        $.ajax({
            
            type: "POST",
            dataType: "json",
            url: "php/alumnofaltas.php",
            data: datos,
            success: function (resolve) {
                result(resolve)
            },
            error: function (xhr, ajaxOptions, thrown) {
                console.log(xhr + ajaxOptions + thrown);
                reject('Error')
            }
        })
    })
}

var regresar = function () {
    var window = require('electron').remote.getCurrentWindow();
    window.close();
}
function reporteLista() {
    let btn = $(this);

    require('electron').remote.getGlobal('info').periodo = periodo;
    require('electron').remote.getGlobal('info').cveMateria = materia;
    require('electron').remote.getGlobal('info').grupo = grupo;
    //require('electron').remote.getGlobal('info').reporte = btn[0].id; para que es esto e.e
    

    pantallaReporte = new BrowserWindow({ width: 1000, height: 800 });
    pantallaReporte.loadURL(url.format({
        pathname: path.join(__dirname, '../reporte.html'),
        protocol: 'file',
        slashes: true
    }));
    pantallaReporte.show();
}


$("#btnAsistencias").on("click", reporteLista)
$("#btnFaltas").on("click", reporteLista)

$("#btnRegresar").on("click", regresar)
$("body").on("click","li > button",onclickaction);
inicia();