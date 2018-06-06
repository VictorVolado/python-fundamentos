const $ = require('jquery')
const {BrowserWindow} = require('electron').remote
app = require('electron').app
path = require('path')
url = require('url')
//constantes para pdf
const ipc = require('electron').ipcRenderer
const botonPDF = document.getElementById('btnPDF')
//activar elemento click del btnPDF

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

        $.ajax({
            
            type: "POST",
            dataType: "json",
            url: "http://localhost/python-fundamentos/php/ListadoAsistencias.php",
            data: datos,
            success: function (data) {
                console.log(data);
            },
            error: function (xhr, ajaxOptions, thrown) {
                console.log(xhr + ajaxOptions + thrown);
                
            }
        });
}
inicia();