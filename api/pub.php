<?php 
// require './utils/safe.php';

if ($_SERVER['HTTP_HOST'] === '192.168.10.103') {
  header('Access-Control-Allow-Origin: *');
}

switch ($_REQUEST['a']) {
  case 'get':
    echo file_get_contents($_REQUEST['url']);
    break;
  case 'getCCTVBasicInfo':
    echo file_get_contents('../static/data/cctv.json');
    break;
}