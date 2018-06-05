<?php
    include 'conexiones.php';
    function () {
        $con = conecta();
        
        $grupo = GetSQLValueString($con, $_POST["grupo"], "text");
        $asistencias = GetSQLValueString($con, $_POST["asistencias"], "int");
        $periodo = GetSQLValueString($con, $_POST["periodo"], "text");
        $ncontrol= GetSQLValueString($con, $_POST["ncontrol"], "text");        
        $nombre = GetSQLValueString($con, $_POST["nombre"], "text");
        $materia = GetSQLValueString($con, $_POST["materia"], "text");
        $QueryAsistencia = "";
        $res = false;
        $query = sprintf("SELECT * FROM reportealumnos WHERE periodo = %s AND ncontrol = %s LIMIT 1;", $periodo, $ncontrol);
        $res_consulta = mysqli_query($con, $query);
        
        if (mysqli_num_rows($resQuery) > 0) {
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