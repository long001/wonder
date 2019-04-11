<?php 
require './config.php';
require './db.php';
require './fs.php';

function err($code, $msg) {
  echo json_encode([
    'code' => $code,
    'msg' => $msg,
  ], JSON_UNESCAPED_UNICODE);
  exit;
}

function res($data) {
  echo json_encode($data, JSON_UNESCAPED_UNICODE);
  exit;
}

function toGBK($str) {
  return iconv('UTF-8', 'GBK', $str);
}

function toUtf8($str) {
  return iconv('GBK', 'UTF-8', $str);
}

function getFileName($path) {
  preg_match_all('/(?:\.)([^.]*)$/', $path, $result);
  return count($result) >= 2 ? $result[1][0] : '';
}

function getFileType($path) {
  $arr = explode('.', basename($path));
  return count($arr) > 1 ? end($arr) : '';
}