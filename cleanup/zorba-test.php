<?php
//Try to load the extension if it's not already loaded.
if(!extension_loaded('zorba_api') && function_exists('dl')) {
 if(strtolower(substr(PHP_OS, 0, 3)) === 'win') {
   if(!dl('php_zorba_api.dll')) return;
 } else {
   if(PHP_SHLIB_SUFFIX === 'PHP_SHLIB_SUFFIX' || PHP_SHLIB_SUFFIX ===
'dylib') {
     if(!dl('lib'.'zorba_api.so')) return;
   } else {
     if(!dl('lib'.'zorba_api.' . PHP_SHLIB_SUFFIX)) return;
   }
 }
} else if(!extension_loaded('zorba_api')) {
 throw new Exception('Zorba extension is not loaded');
} else {
 echo "Success!\n";
}

?>
