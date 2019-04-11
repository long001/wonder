<?php 

// 删除文件失败原因
function whyFsOperateError($path) {
  if (!file_exists($path)) {
    err(2, '当前目录不存在：'.$path);
  } else if (!is_readable($path)) {
    err(2, '当前目录不可读：'.$path);
  } else if (!is_writeable($path)) {
    err(2, '当前目录不可写：'.$path);
  } else {
    err(2, '未知的文件操作错误类型');
  }
}

// 目录-递归删除
function rm($path) {
  if (is_dir($path)) {
    $handler = opendir($path);
    while ($filename = readdir($handler)) {
      if ($filename === '.' || $filename === '..') {
        continue;
      }
      rm($path.'/'.$filename);
    }
    closedir($handler);
    rmdir($path);
  } else {
    unlink($path) or die(whyFsOperateError($path));
  }
}

// 目录-递归创建
function mkPath($path) {
  $path = preg_replace('/((\\\)|(\/))+/', '/', $path.'/');
  $path = preg_replace('/\/$/', '', $path);
  $arrPath = split('/', $path);
  $path = '';

  foreach ($arrPath as $key => $value) {
    $path .= '/'.$value;
    if (!is_dir($path)) {
      mkdir($path) or die(whyFsOperateError($path));
    }
  }
}

// 递归拷贝
function cpDir($dirFrom, $dirTo) {
  if (is_dir($dirFrom)) {
    $handler = opendir($dirFrom);
    mkPath($dirTo);

    while ($filename = readdir($handler)) {
      if ($filename === '.' || $filename === '..') {
        continue;
      }

      $from = $dirFrom.'/'.$filename;
      $to = $dirTo.'/'.$filename;
      
      if (is_dir($from)) {
        cpDir($from, $to);
      } else {
        copy($from, $to);
      }
    }
    closedir($handler);
  } else {
    copy($dirFrom, $dirTo);
  }
}