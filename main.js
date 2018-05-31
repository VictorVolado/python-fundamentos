const{app,BrowserWindow} = require('electron'),
path = require('path'),
url = require('url');
//constantes para PDF
const electron = require('electron');
//sistemas de archivos
const fs = require('fs');
//Acceso al sistema operativo
const os = require('os');
//para declarar una funcion remota
const ipc = electron.ipcMain;
//acceso ala terminal linea de comandos
const shell = electron.shell;
let pantallaLogin;

global.informacion ={
  usuario:'',
  token:'',
  periodo:'',
  claveMateria:'',
  nombreMateria:'',
  grupo:''
}

global.informacion2 = {
  faltas:[],
  asistensias:[]
}

ipc.on('print-to-pdf',function(event){
  const pdfPath=path.join(os.tmpdir(),'print.pdf');
  const win = BrowserWindow.fromWebContents(event.sender);
  win.webContents.printToPDF({},function(err,data){
    if(err) throw error 
    fs.writeFile(pdfPath,data,function(error){
      if(error){
        throw error
      }
      shell.openExternal('file://'+pdfPath);
      

    })
  })
});

function muestraPantallaLogin(){
pantallaLogin = new BrowserWindow ({width:800,heigth:600});
pantallaLogin.loadURL(url.format({
  pathname: path.join(__dirname,'index.html'),
  protocol: 'file',
  slashes: true
}))
pantallaLogin.show();
}

app.on('ready',muestraPantallaLogin);
