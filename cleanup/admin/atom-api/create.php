<?php
try {
class Post {
	// XML Handlers
	protected $dom; // DOMDocument
	protected $root; // Root node (entry)
	protected $xpath; // DOMXPath
	protected $body; // String, entire entry

	// Atom elements (raw data; DOMElement/Text);
	public $title;
	public $titleObj;

	public $author;
	public $authorObj;

		public $name;
		public $nameObj;

		public $email;
		public $emailObj;

	public $rights;
	public $rightsObj;

	public $summary;
	public $summaryObj;

	public $content;
	public $contentObj;

	public $link;
	public $linkObj;

	// Atom element attributes
	
	// Types: text, html, xhtml, xml, markdown
	public $allTypes;
	public $titleType;
	public $contentType = 'xhtml';
	public $summaryType;
	
	// Options
	public $metadataFormat = 'microformats'; // microdata, rdf
	
	/* Convenience Properties */
	
	// Database
	public $collectionUri = 'http://db.nospoon.tv/atom/edit';
	public $editPath;
	public $editUri;
	
	// XML Namespaces
	const ATOM = 'http://www.w3.org/2005/Atom';
	const HTML = 'http://www.w3.org/1999/xhtml';
	
	// MIME types
	const ATOM_TYPE = 'application/atom+xml';
	const HTML_TYPE = 'text/html';
	const XHTML_TYPE = 'application/xhtml+xml';
	const XML_TYPE = 'application/xml';
	
	// Character sets
	const UTF8 = 'UTF-8';
	const ASCII = 'US-ASCII';
	const W_EUROPE = 'ISO-8859-1';
	
	function __get($property) {
		if (isset($this->$property)) {
			return $this->$property;
		}
		return false;
	}
	
	function __set($property, $value) {
		$this->$property = $value;
	}
	
	// Set element values from array if supplied
	function __construct($allProperties = NULL) {
		$this->dom = new DOMDocument('1.0', 'utf-8');
		$this->dom->formatOutput = true;
		$this->root = $this->atomElement('entry');
		$this->dom->appendChild($this->root);

		if(!empty($allProperties)) {
			$this->loadProperties($allProperties);
		}
	}
	
	public function loadProperties(array $properties) {
		foreach($properties as $property => $value) {
			if(is_array($value)) {
				switch($property) {
					case 'author':
						foreach($value as $authorProperty => $authorValue) {
							switch($authorProperty) {
								case 'name':
									$this->name = $authorValue;
									break;
								case 'email':
									$this->email = $authorValue;
									break;
							}
						}
						$this->author = true;
					break;
					case 'link':
						$this->link = $value;
						break;
				}
			} else {
				$this->$property = $value;
			}
		}
	}
	
	protected function domElement($ns, $name, $value) {
		if(isset($this->dom)) {
			return $this->dom->createElementNS($ns, $name, $value);
		}
		return false; // Exception?
	}
	
	protected function atomElement($name, $value = NULL) {
		return $this->domElement(self::ATOM, $name, $value);
	}
	
	protected function htmlElement($name, $value = NULL) {
		return $this->domElement(self::HTML, $name, $value);
	}
	
	// Check type of content or other property
	protected function isXhtml($property = NULL) {
		switch($property) {
			case 'xhtml':
			case self::XHTML_TYPE:
				return true;
			default:
				return false;
		}
	}
	
	protected function appendXml(&$atomElement, $xmlFragment, $type = self::XML_TYPE, &$insertRef = NULL, $insertOrder = 'before') {
		if(is_string($atomElement)) {
			$atomElement = $this->atomElement($atomElement);
		}
	
		$atomElement->setAttribute('type', $type);
		if(!empty($insertRef)) {
			if($insertOrder == 'before') { // {'insert'.ucfirst($insertOrder)}?
				$this->root->insertBefore($atomElement, $insertRef);
			}
		}
	
		if($type == 'xhtml') {
			$div = $this->htmlElement('div');
			if($atomElement->nodeName == 'content') {
				if($this->metadataFormat == 'microformats') {
					$div->setAttribute('class', 'entry-content');
				}
			}
			//$text = $this->htmlElement('p', $this->content);
			$xhtml = $this->dom->createDocumentFragment();
			$xhtml->appendXml($xmlFragment);
			if(empty($insertRef)) {
				$this->root->appendChild($atomElement);
			}
			$atomElement->appendChild($div);
			return $div->appendChild($xhtml);
		} else {
			$xml = $this->dom->createDocumentFragment();
			$xml->appendXml($xmlFragment);
			if(empty($insertRef)) {
				$this->root->appendChild($atomElement);
			}
			return $atomElement->appendChild($xml);
		}
	}
	
	protected function appendXHTML(&$atomElement, $html, &$insertRef = NULL, $insertOrder = 'before') {
		return $this->appendXml($atomElement, $html, 'xhtml', $insertRef, $insertOrder);
	}
	
	protected function appendText() {}
	
	protected function appendNode($nodeName, $nodeValue = NULL, &$insertRef = NULL, $insertOrder = 'before') {
		if(empty($nodeValue)) $nodeValue =& $this->$nodeName;
		$nodeType =& $this->{strtolower($nodeName).'Type'};
		$nodeObj =& $this->{$nodeName.'Obj'};
		switch($nodeType) {
			case 'xhtml':
			case self::XHTML_TYPE:
				$nodeObj = $this->atomElement($nodeName);
				$nodeValue = "<p>{$nodeValue}</p>";
				return $this->appendXHTML($nodeObj, $nodeValue, $insertRef, $insertOrder); // Markdown etc. parsing func call
			case 'xml':
			case self::XML_TYPE:
				$nodeObj = $this->atomElement($nodeName);
				return $this->appendXml($nodeObj, $nodeValue, $insertRef, $insertOrder);
			case 'text':
				break;
			default:
				if(is_string($nodeValue)) $nodeObj = $this->atomElement($nodeName, $nodeValue);
				return $this->root->appendChild($nodeObj); // change to $this->appendText();
		}
	}
	
	protected function appendIfSet($nodeName, $nodeValue = NULL, &$insertRef = NULL, $insertOrder = 'before') {
		if(isset($this->$nodeName)) {
			return $this->appendNode($nodeName, $nodeValue, $insertRef, $insertOrder);
		}
		return false;
	}
	
	protected function appendToIfSet(&$appendNode, $nodeName, $nodeValue = NULL) {
		$nodeObj =& $this->{$nodeName.'Obj'};
		if(empty($nodeValue)) { // Value stored in property
			if(isset($this->$nodeName)) {
				$nodeObj = $this->atomElement($nodeName, $this->$nodeName);
				return $appendNode->appendChild($nodeObj);
			}
			throw new Exception('No value set for node');
		} else { // Value overridden
			$nodeObj = $this->atomElement($nodeName, $nodeValue);
			return $appendNode->appendChild($nodeObj);
		}
	}
	
	protected function createIfSet($nodeName) {
		if(isset($this->$nodeName)) {
			switch($nodeName) {
				case 'author':
					if(isset($this->name) || isset($this->email)) {
						$author = $this->authorObj = $this->atomElement('author');
						$this->appendToIfSet($author, 'name');
						$this->appendToIfSet($author, 'email');
					} else {
						$author = $this->authorObj = $this->atomElement('author', $this->author);
					}
					$this->appendNode('author');
					break;
				case 'content':
					$this->appendNode('content');
					if(!isset($this->summary)) {
						if($this->isXhtml($this->contentType)) { // Content is XHTML
							$contentPara = $this->contentObj->getElementsByTagName('p')->item(0)->cloneNode(true); // First paragraph of content
							if($this->isXhtml($this->summaryType)) { // Summary is also XHTML
								$this->summary = $contentPara->ownerDocument->saveXML($contentPara);
								$summary = $this->atomElement('summary');
								$this->appendXHTML($summary, $this->summary, $content);
							} else { // Summary is plain text (well actually…)
								$this->summary = $contentPara->nodeValue;
								$summary = $this->atomElement('summary', $this->summary);
								$this->root->insertBefore($summary, $content);
							}
						} else { // Content is plain text
							$matches = array();
							// Regex for parsing sentences - http://stackoverflow.com/a/1936398/214325
							preg_match('/(\S.+?[.!?])(?=\s+|$)/', $this->content, $matches);
							if($this->isXhtml($this->summaryType)) { // Summary is XHTML
								$summary = $this->atomElement('summary');
								$this->appendXHTML($summary, "<p>{$matches[0]}</p>", $content);
							} else { // Summary is also plain text
								$summary = $this->atomElement('summary', $matches[0]);
								$this->root->insertBefore($summary, $content);
							}
						}				
					}
					break;
				case 'link':
					if(is_array($this->link)) {
						$i = 0;
						$links = array();
						foreach($this->link as $link) {
							if(is_array($link)) {
								$links[$i] = $this->atomElement('link');
								foreach($link as $attr => $val) {
									$links[$i]->setAttribute($attr, $val);
								}
							}
							++$i;
						}
						unset($i);
						foreach($links as $atomLink) {
							$this->root->appendChild($atomLink);
						}
					} else {
						$link = $this->atomElement('link');
						$this->root->appendChild($link);
					}
					break;
				default:
					$this->appendIfSet($nodeName);
			}
		}
	}
	
	public static function contentTypeHeader($type = 'atom') {
		switch($type) {
			case 'atom':
				$type = self::ATOM_TYPE;
				break;
			case 'xml':
				$type = self::XML_TYPE;
				break;
			case 'xhtml':
				$type = self::XHTML_TYPE;
				break;
			case 'html':
				$type = self::HTML_TYPE;
				break;
		}
		return 'Content-Type: '.$type.'; charset='.self::UTF8;
	}
	
	public function submit() {
		if(!isset($this->body)) {
			$this->build();
		}
		
		if(isset($this->editPath)) {
			$this->editUri = $this->collectionUri.$this->editPath;
		}
		
		$headers = array(self::contentTypeHeader());
		
		// Use curl to post to the blog.
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $this->editUri);
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
		curl_setopt($ch, CURLOPT_POST, 1);
		curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
		curl_setopt($ch, CURLINFO_HEADER_OUT, 1);
		curl_setopt($ch, CURLOPT_VERBOSE, 1);
		curl_setopt($ch, CURLOPT_POSTFIELDS, $this->body);
		
		$data = curl_exec($ch);
		
		if(DEBUG_MODE) {
			print_r(curl_getinfo($ch));
		}
		
		if (curl_errno($ch) && DEBUG_MODE) {
			print curl_error($ch);
			return false;
		} else {
			curl_close($ch);
			return true;
		}
	}
	
	// Generate atom:entry
	public function build() {
		$this->createIfSet('title');
		$this->createIfSet('author');
		$this->createIfSet('rights');
		$this->createIfSet('summary');	
		$this->createIfSet('content');
		$this->createIfSet('link');
		$this->body = $this->dom->saveXML();
		return $this->body;
	}
}
header(Post::contentTypeHeader('atom'));
//header(Post::contentTypeHeader('xhtml'));
//header(Post::contentTypeHeader('html'));
//header(Post::contentTypeHeader('xml'));
$post = new Post(array(
	'title' => 'Robots Powered Aliens Run on Fours'
	, 'author' => array(
		'name' => 'Robort Cunningham',
		'email' => 'rcunningham@dumbo.net'
	)
	, 'rights' => 'Copyright 2012'
	, 'content' => 'What do I wanna say?'
	, 'link' => array(
		array(
			'rel' => 'enclosure',
			'type' => 'audio/mpeg',
			'title' => 'MP3',
			'href' => 'http://www.example.org/myaudiofile.mp3',
			'length' => '1234'
		)
		, array(
			'rel' => 'enclosure',
			'type' => 'application/x-bittorrent',
			'title' => 'BitTorrent',
			'href' => 'http://www.example.org/myaudiofile.torrent',
			'length' => '1234'
		)
	)
));
//$post->contentType = NULL;
$post->titleType = 'xhtml';
$post->summaryType = 'xhtml';
$post->editPath = '/content/read/reviews?id=urn:uuid:0fba17cd-a212-40ac-bb12-c765b927c3c9';
echo $post->build();
} catch(Exception $e) {
	echo $e->getMessage();
}
?>