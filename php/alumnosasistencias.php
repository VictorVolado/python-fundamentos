<?php
    include 'conexiones.php';
    function asistencias () {
        $con = conecta();
        
        $grupo = GetSQLValueString($_POST["grupo"], "text",$con);
        $asistencias = GetSQLValueString($_POST["asistencias"], "int",$con);
        $periodo = GetSQLValueString($_POST["periodo"], "text",$con);
        $ncontrol= GetSQLValueString($_POST["ncontrol"], "text",$con);        
        $nombre = GetSQLValueString($_POST["nombre"], "text",$con);
        $materia = GetSQLValueString($_POST["materia"], "text",$con);
        $QueryAsistencia = "";
        $res = false;
        $query = sprintf("SELECT * FROM reportealumnos WHERE periodo = %s AND ncontrol = %s LIMIT 1;", $periodo, $ncontrol);
        $res_consulta = mysqli_query($con, $query);
        
        if (mysqli_num_rows($res_consulta) > 0) {
            $QueryAsistencia = sprintf("UPDATE reportealumnos SET asistencias = %s WHERE periodo = %s AND ncontrol = %s;", $asistencias, $periodo, $ncontrol);
        } else {
            $QueryAsistencia = sprintf("INSERT INTO reportealumnos VALUES (default, %s,%s, %s, %s, %s, 0, %s);", $periodo, $ncontrol, $nombre, $materia, $grupo, $asistencias);
        }

        
        mysqli_query($con, $QueryAsistencia);
        if(mysqli_affected_rows($con) > 0) {
            $res = true;
        }
        $jsonfinal = array('res' => $res);
        print json_encode($jsonfinal);
    }

    $opc = $_POST["opc"];
    switch ($opc) {
        case 'alumnoAsistencias':
            asistencias();
            break;
        default:
            break;
    }
    



?>