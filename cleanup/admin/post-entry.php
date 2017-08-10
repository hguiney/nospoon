<?='<?xml version="1.0" encoding="UTF-8"?>'?>

<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<title>Content Feeds</title>
<link title="Hugh Guiney" href="/users/hguiney" type="application/xhtml+xml" rel="author" />
<style type="text/css"></style>
</head>
<body>

<article role="main">

<?=file_get_contents('./post-entry.xml')?>


<section>
<h3>Existing Sources</h3>
<?=file_get_contents('./sources.xml')?>

</section>

</article>

</body>
</html>