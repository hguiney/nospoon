<?xml version="1.0" ?>
<feed>
{
/feed/id,
/feed/title,
/feed/updated,
for $e in (/feed/entry)
where starts-with(string($e/published),"2011-10")
return ( "&#x0a;",$e, "&#x0a;")
}
</feed>