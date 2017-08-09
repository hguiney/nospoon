<?php
require('includes/Array2XML.php');

$xml = Array2XML::createXML('data', $_POST);
echo $xml->saveXML();
?>