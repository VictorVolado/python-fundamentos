<?php
    include 'conexiones.php';
    function lista(){
    $con =conecta();
    $res=false;
    $nombre="";
    $faltas="";
    $ncontrol="";
    $alumnos= array();

    $grupo = GetSQLValueString($_POST["grupo"], "text", $con);
    $materia = GetSQLValueString($_POST["materia"], "text", $con);
    $periodo = GetSQLValueString($_POST["periodo"], "text", $con);

    $queryListadoFaltas=sprintf("SELECT ncontrol,nombre,faltas FROM reportealumnos WHERE periodo=%s AND materia=%s AND grupo =%s ORDER BY faltas DESC",$periodo,$materia,$grupo);

    $resultadoQuery=mysqli_query($con,$queryListadoFaltas);

    if(mysqli_num_rows($resultadoQuery)>0){
        $res=true;
        while($regConsulta=mysqli_fetch_array($resultadoQuery)){
            $nombre=utf8_encode($regConsulta["nombre"]);
            $ncontrol  = $regConsulta["ncontrol"];
            $faltas=$regConsulta["faltas"];
            $alumnos[] =  array('nombre'=> $nombre,'ncontrol' => $ncontrol,'faltas'=>$faltas );
    }
}
$salidaJSON = array('res' => $res, 'alumnos' => $alumnos);
print json_encode($salidaJSON);
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