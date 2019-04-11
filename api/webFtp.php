<?php 
require 'safe.php';

// 下划线开头的变量，表示GBK编码
$path = $_REQUEST['path'];
$_path = toGBK($path);

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
        'name' => toUtf8($_fileName),
      ];
    }

    res($result);
    break;
  case 'makeDir':
    $_names = explode('/', toGBK($_REQUEST['name']));

    foreach ($_names as $key => $_value) {
      if (!$_value) continue;
      $arr = explode('|', $_value);
      foreach ($arr as $key => $_value2) {
        $_tmpPath = $_path.'/'.$_value2;
        if (!is_dir($_tmpPath)) {
          mkdir($_tmpPath);
        }
      }
      $_path .= '/'.end($arr);
    }

    err(0, '目录创建成功');
    break;
  case 'makeFile':
    $_names = explode('|', toGBK($_REQUEST['name']));

    foreach ($_names as $key => $_value) {
      $_tmpPath = $_path.'/'.$_value;
      if (!file_exists($_tmpPath)) {
        file_put_contents($_tmpPath, '');
      }
    }

    err(0, '文件创建成功');
    break;
  case 'rename':
    $_names = json_decode($_REQUEST['names'], true);
    foreach ($_names as $key => $value) {
      $_names[$key] = toGBK($value);
    }
    $_newName = toGBK($_REQUEST['newName']);
    $_dirFrom = toGBK($_REQUEST['dirFrom']);
    $_dirTo = toGBK($_REQUEST['dirTo']);

    if (count($_names) === 1) {
      $_pathFrom = $_dirFrom.'/'.$_names[0];
      $_pathTo = $_dirTo.'/'.$_newName;

      print_r([
        'type' => 'single',
        '$_pathFrom' => $_pathFrom,
        '$_pathTo' => $_pathTo,
      ]);
    } else {
      foreach ($_names as $key => $_value) {
        $_pathFrom = $_dirFrom.'/'.$_value;
        $_fromFileType = getFileType($_pathFrom);
        $_pathTo = $_dirTo.'/'.$_value.'('.$key.')'.($_fromFileType ? '.'.$_fromFileType : '');
        
        print_r([
          'type' => 'mutiple',
          '$_pathFrom' => $_pathFrom,
          '$_pathTo' => $_pathTo,
        ]);
      }
    }

    err(0, '操作成功');
    break;
  case 'fileDelete':
    $names = json_decode($_REQUEST['names'], true);
    foreach ($names as $key => $value) {
      $_tmpPath = $_path.'/'.toGBK($value);
      if (file_exists($_tmpPath)) {
        rm($_tmpPath);
      }
    }
    err(0, '删除成功');
    break;
}