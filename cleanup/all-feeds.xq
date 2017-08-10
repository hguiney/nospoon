xquery version "1.0";
declare namespace atom="http://www.w3.org/2005/Atom";
let $current := substring-before(base-uri(/atom:feed),'/.feed.atom'),
$current-path := substring-after($current,'/db')
for $i in (collection($current)/atom:feed)
    return $i