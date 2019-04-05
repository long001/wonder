<?php 
require 'safe.php';

switch ($_REQUEST['a']) {
  case 'openDir':
    $path = $_REQUEST['path'];
    
    if (!is_dir($path)) {
      err(2, '当前路径不是文件夹 '.$path);
    }
    
    if (!is_readable($path)) {
      err(2, '当前路径不可读  '.$path);
    }

    $handler = opendir($path);
    $result = [];
    while ($_fileName = readdir($handler)) {
      if ($_fileName === '.' || $_fileName === '..') {
        continue;
      }
      $filename = iconv('GBK', 'UTF-8', $_fileName);
      $_fullPath = $path.'/'.$_fileName;
      $result[] = [
        'isDir' => is_dir($_fullPath),
        'mtime' => filemtime($_fullPath),
        'name' => $filename
      ];
    }
    res($result);
    break;
}