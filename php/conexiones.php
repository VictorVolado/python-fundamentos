<?php
    function conecta () {
        $con = mysqli_connect("127.0.0.1", "root", "", "paselista");
        mysqli_set_charset($con, "utf8");
        return $con;
    }
    function GetSQLValueString($con, $theValue, $theType, $theDefinedValue = "", $theNotDefinedValue = "") {
        $theValue = get_magic_quotes_gpc() ? stripslashes($theValue) : $theValue;
        $theValue = function_exists("mysql_real_escape_string") ? mysql_real_escape_string($theValue) : mysqli_real_escape_string($con, $theValue);
        switch ($theType) {
            case "text":
            $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
            break;    
            case "long":
            case "int":
            $theValue = ($theValue != "") ? intval($theValue) : "NULL";
            break;
            case "double":
            $theValue = ($theValue != "") ? "'" . doubleval($theValue) . "'" : "NULL";
            break;
            case "date":
            $theValue = ($theValue != "") ? "'" . $theValue . "'" : "NULL";
            break;
            case "defined":
            $theValue = ($theValue != "") ? $theDefinedValue : $theNotDefinedValue;
            break;
        }
        return $theValue;
    }
?>
