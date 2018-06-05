<?php
    include 'conexiones.php';
    function lista(){
    $con =conecta();
    $res=false;
    $nombre="";
    $faltas="";
    $ncontrol="";
    $grupo = GetSQLValueString($_POST["grupo"], "text");
    $materia = GetSQLValueString($_POST["materia"], "text");
    $periodo = GetSQLValueString($_POST["periodo"], "text");

    $queryListadoFaltas=sprintf("SELECT ncontrol,nombre,faltas FROM reportealumnos=%s AND materia=%s AND grupo =%s ORDER BY faltas DESC",$periodo,$materia,$grupo);

    $resultadoQuery=mysqli_query($con,$queryListadoAsistencias);

    if(mysqli_num_rows($resultadoQuery>0)){
        $res=true;
        while($regConsulta=mysqli_fetch_array($resultadoQuery)){
            $nombre=utf8_encode($regConsulta["nombre"]);
            $ncontrol  = $regConsulta["ncontrol"];
            $faltas=$regConsulta["faltas"];

    }
}

$salidaJSON = array('res' => $res,'nombre'=> $nombre,'ncontrol' => $ncontrol,'faltas'=>$faltas );
}
$opc = $_POST["opc"];
switch ($opc) {
	case 'ListaFaltas':
		lista();
		break;
	
	default:
		# code...
		break;
}

?> 