<?php 
require 'safe.php';

$path = $_REQUEST['path'];
$_path = iconv('UTF-8', 'GBK', $path);

switch ($_REQUEST['a']) {
  case 'openDir':
    if (!is_dir($_path)) {
      err(2, '当前路径不是文件夹 '.$_path);
    }
    if (!is_readable($_path)) {
      err(2, '当前路径不可读  '.$_path);
    }

    $handler = opendir($_path);
    $result = [];

    while ($_fileName = readdir($handler)) {
      if ($_fileName === '.' || $_fileName === '..') continue;

      $_fullPath = $_path.'/'.$_fileName;
      $result[] = [
        'isDir' => is_dir($_fullPath),
        'mtime' => filemtime($_fullPath),
        'name' => iconv('GBK', 'UTF-8', $_fileName),
      ];
    }

    res($result);
    break;
  case 'dirMake':
    $_pathArr = explode('/', $_path);
    $_path = '';

    foreach ($_pathArr as $key => $value) {
      $arr = explode('|', $value);
      foreach ($arr as $key => $value2) {
        $_tmp = $_path.$value2;
        if (!is_dir($_tmp)) {
          mkdir($_tmp);
        }
      }
      $_path .= $arr[0].'/';
    }

    err(0, '目录创建成功');
    break;
  case 'fileMake':

    break;
  case 'dirRename':
    echo 'dirRename';
    print_r($_REQUEST);
    break;
  case 'fileRename':
    echo 'fileRename';
    print_r($_REQUEST);
    break;
  case 'fileDelete':
    $names = json_decode($_REQUEST['names'], true);

    foreach ($names as $key => $value) {
      rm($_path.'/'.iconv('UTF-8', 'GBK', $value));
    }

    err(0, '删除成功');
    break;
}