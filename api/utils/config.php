<?php 
error_reporting(1);
header('Content-Type: text/html; Charset=utf-8');

if (preg_match('/808/', 'http://localhost:8080/')) {
  header('Access-Control-Allow-Origin: *');
}

// $mysqli = new mysqli('127.0.0.1', 'root', 'root') or die(err(1, '数据库连接失败'));
// $mysqli->query("SET NAMES UTF8") or die(err(1, '字符集设置失败'));

