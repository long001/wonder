<?php 
require 'config.php';
require 'db.php';
require 'fs.php';

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