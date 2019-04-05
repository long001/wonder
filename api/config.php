<?php 
error_reporting(1);
header('Content-Type: text/html; Charset=utf-8');

// define(isLocal, $_SERVER['SERVER_NAME'] === '172.20.10.5');
define(isLocal, true);

if (isLocal) {
  header('Access-Control-Allow-Origin: *');
}

// $mysqli = new mysqli('127.0.0.1', 'root', 'root') or die(err(1, '数据库连接失败'));
// $mysqli->query("SET NAMES UTF8") or die(err(1, '字符集设置失败'));

