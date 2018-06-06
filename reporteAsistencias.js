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

function inicia(){

    reporteAlumnoFaltas();
}
    function reporteAlumnoFaltas () {
        
        require('electron').remote.getGlobal('info').periodo = periodo;
        require('electron').remote.getGlobal('info').cveMateria = materia;
        require('electron').remote.getGlobal('info').grupo = grupo;

        var datos = "opc=alumnoFaltas" +"&periodo=" + periodo+"&materia=" + materia +"&grupo=" + grupo;

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