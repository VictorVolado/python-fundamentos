<?php
    include 'conexiones.php';
    function () {
        $con = conecta();
        
        $grupo = GetSQLValueString($con, $_POST["grupo"], "text");
        $faltas = GetSQLValueString($con, $_POST["faltas"], "int");
        $periodo = GetSQLValueString($con, $_POST["periodo"], "text");
        $ncontrol= GetSQLValueString($con, $_POST["ncontrol"], "text");        
        $nombre = GetSQLValueString($con, $_POST["nombre"], "text");
        $materia = GetSQLValueString($con, $_POST["materia"], "text");
        $QueryFaltas = "";
        $res = false;
        $query = sprintf("SELECT * FROM reportealumnos WHERE periodo = %s AND ncontrol = %s LIMIT 1;", $periodo, $ncontrol);
        $res_consulta = mysqli_query($con, $query);
        
        if (mysqli_num_rows($resQuery) > 0) {
            $QueryFaltas = sprintf("UPDATE reportealumnos SET faltas = %s WHERE periodo = %s AND ncontrol = %s;", $faltas, $periodo, $ncontrol);
        } else {
            $QueryFaltas = sprintf("INSERT INTO reportealumnos VALUES (default, %s,%s, %s, %s, %s, 0, %s);", $periodo, $ncontrol, $nombre, $materia, $grupo, $faltas);
        }
        mysqli_query($con, $QueryFaltas);
        if(mysqli_affected_rows($con) > 0) {
            $res = true;
        }
        $jsonfinal = array('res' => $res);
        print json_encode($jsonfinal);
    }
    $opc = $_POST["opc"];
    switch ($opc) {
        case 'alumnoFaltas':
            faltas();
            break;
        default:
            break;
    }
    



?>