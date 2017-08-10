<?php if(isset($_POST)) { ?>
<h2><?=$_POST['title']?></h2>
<?=$_POST['body']?>
<?
$tags = explode(',', $_POST['tags']);
echo '<p><pre>' . print_r($tags) . '</pre></p>';
?>
<?php } ?>