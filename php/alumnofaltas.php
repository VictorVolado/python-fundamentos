<?php
    include 'conexiones.php';
    function faltas () {
        $con = conecta();
        
        $grupo = GetSQLValueString($_POST["grupo"], "text",$con);
        $faltas = GetSQLValueString($_POST["faltas"], "int",$con);
        $periodo = GetSQLValueString($_POST["periodo"], "text",$con);
        $ncontrol= GetSQLValueString($_POST["ncontrol"], "text",$con);        
        $nombre = GetSQLValueString($_POST["nombre"], "text",$con);
        $materia = GetSQLValueString($_POST["materia"], "text",$con);
        $QueryFaltas = "";
        $res = false;
        $query = sprintf("SELECT * FROM reportealumnos WHERE periodo = %s AND ncontrol = %s LIMIT 1;", $periodo, $ncontrol);
        $res_consulta = mysqli_query($con, $query);
        
        if (mysqli_num_rows($res_consulta) > 0) {
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