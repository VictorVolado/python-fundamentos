<?php
    include 'conexiones.php';
    function lista(){
        $con =conecta();
        $res=false;
        $nombre="";
        $asistencias="";
        $ncontrol="";
        $alumnos= array();
        $grupo = GetSQLValueString($_POST["grupo"], "text", $con);
        $materia = GetSQLValueString($_POST["materia"], "text", $con);
        $periodo = GetSQLValueString($_POST["periodo"], "text", $con);

        $queryListadoAsistencias=sprintf("SELECT ncontrol,nombre,asistencias FROM reportealumnos WHERE periodo=%s AND materia=%s AND grupo =%s ORDER BY asistencias DESC",$periodo,$materia,$grupo);
        $resultadoQuery=mysqli_query($con,$queryListadoAsistencias);

        if(mysqli_num_rows($resultadoQuery)>0){
            $res=true;
            while($regConsulta=mysqli_fetch_array($resultadoQuery)){
                $nombre=utf8_encode($regConsulta["nombre"]);
                $ncontrol  = $regConsulta["ncontrol"];
                $asistencias=$regConsulta["asistencias"];
                $alumnos[] =  array('nombre'=> $nombre,'ncontrol' => $ncontrol,'asistencias'=>$asistencias );
            }
        }
        $salidaJSON = array('res' => $res, 'alumnos' => $alumnos);
        print json_encode($salidaJSON);

    }

$opc = $_POST["opc"];
switch ($opc) {
	case 'ListaAsistencias':
		lista();
		break;
	
	default:
		# code...
		break;
}

?> 