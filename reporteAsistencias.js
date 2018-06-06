const $ = require('jquery')
const {BrowserWindow} = require('electron').remote
app = require('electron').app
path = require('path')
url = require('url')
//constantes para pdf
const ipc = require('electron').ipcRenderer
const botonPDF = document.getElementById('botonPDF')
//activar elemento click del btnPDF
botonPDF.addEventListener('click',function(event){

    botonPDF.style.display ="none"
    ipc.send('print-to-pdf')

});
function inicia(){

    reporteAlumnoFaltas();
}
    function reporteAlumnoFaltas () {
        var periodo;
        var materia;
        var grupo;

       periodo= require('electron').remote.getGlobal('informacion').periodo;
       materia= require('electron').remote.getGlobal('informacion').claveMateria;
       grupo= require('electron').remote.getGlobal('informacion').grupo;

        var datos = "opc=ListaAsistencias" +"&periodo=" + periodo+"&materia=" + materia +"&grupo=" + grupo;
        var resultado="";
        $.ajax({
            
            type: "POST",
            dataType: "json",
            url: "http://localhost/python-fundamentos/php/ListadoAsistencias.php",
            data: datos,
            success: function (data) {
                for(var i = 0; i<data.alumnos.length;i++){
                    resultado += "<li>"+data.alumnos[i].nombre+" "+data.alumnos[i].ncontrol+"    Asistencias:  "+data.alumnos[i].asistencias;
                    
                
                }

                $("#ltsReporteAsistencias").html(resultado);
            },
            error: function (xhr, ajaxOptions, thrown) {
                console.log(xhr + ajaxOptions + thrown);
                
            }
        });
}
var regresar = function () {
    var window = require('electron').remote.getCurrentWindow();
    window.close();
}

$("#btnRegresar").on("click", regresar)
inicia();