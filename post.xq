xquery version "1.0";

declare namespace request = "http://exist-db.org/xquery/request";
declare namespace null = "http://vocab.nospoon.tv/null#";
declare default element namespace "http://vocab.nospoon.tv/null#";

import module namespace httpclient = "http://exist-db.org/xquery/httpclient"; 
import module namespace util = "http://exist-db.org/xquery/util";

declare function local:hasBrackets($name as xs:string)
{
	if ( contains($name, '[') and contains($name, ']') )
	then boolean('true')
	else boolean('false')
};

declare function local:insideBrackets($name as xs:string)
{
	substring-before(substring-after($name, '['), ']')
};

declare function local:outsideBrackets($name as xs:string)
{
	substring-before($name, '[')
};

declare function local:brackets2tree($params as node()+)
{
	for $param in $params
	let $name := xs:string($param/@name)
	let $value := xs:string($param/@value)
	return
		if( local:hasBrackets($name) )
		then
			let $inside := local:insideBrackets($name)
			let $outside := local:outsideBrackets($name)
			return
			if( $inside != '' )
			then
				element { $inside }
				{
					if( local:hasBrackets($inside) )
					then
						let $tokenized := substring-before(substring-after(string-join(tokenize($name, '\]\['), ' '), concat($inside, ' ')), ']')
						return
							if($tokenized != '')
							then element {$tokenized} {}
							else ()
					else $value
				}
			else ()
		else element {$name } { $value }
};

declare function local:form2xml($data)
{
	httpclient:post(xs:anyURI('http://site.nospoon.tv/post.php'), $data, false(), <headers />)
};

(:
let $data :=
<params xmlns="http://vocab.nospoon.tv/null#">
{
for $parameter in request:get-parameter-names()
return
	<param name="{$parameter}" value="{request:get-parameter($parameter, '')}"/>
}
</params>

let $topic :=
<topic>
{
	let $topicData := $data/null:param[starts-with(@name, 'topic')]
	return local:brackets2tree($topicData)
}
</topic>
:)

<ovml:ovml xmlns="http://vocab.nospoon.tv/ovml#" xmlns:ovml="http://vocab.nospoon.tv/ovml#">
	<post>
		{request:get-data()}
	</post>
</ovml:ovml>