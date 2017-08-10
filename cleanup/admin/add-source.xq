declare default element namespace 'http://www.w3.org/1999/xhtml';
declare namespace xmldb = "http://exist-db.org/xquery/xmldb";
declare option exist:serialize "method=xhtml media-type=application/xhtml+xml omit-xml-declaration=no indent=yes 
        doctype-system=about:legacy-compat";
<html>
<head>
<meta charset="UTF-8" />
<title>Content Feeds</title>
<link title="Hugh Guiney" href="/users/hguiney" type="application/xhtml+xml" rel="author" />
<style type="text/css">
/*<![CDATA[*/
article {
	background-color:black;
}
/*]]>*/
</style>
</head>
<body>

<article role="main">

{
for $form in document('xmldb:exist:///db/home/me/post-entry')/form
return $form
}

<section>
<h3>Existing Sources</h3>
{
for $ul in document('xmldb:exist:///db/home/me/sources')/ul
return $ul
}
</section>

</article>

</body>
</html>