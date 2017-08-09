<?php
require('search.php');
class AmazonCoverArt extends AmazonECS {
	protected $asin;
	protected $size;
	protected $category;
	protected $url;
	protected $width;
	protected $height;
	protected $resizeFactor;
	protected $detailPageUrl;
	//protected $model;
	
	function __get($name) {
		return $this->$name;
	}
	
	function __construct($asin, $category, $size, $resize_factor = 0.51) {
		$this->asin = $asin;
		$this->category = $category;
		$this->size = ucfirst(strtolower($size));
		$this->resizeFactor = $resize_factor;
		//$this->model = new AmazonCoverArtModel();
		
		$cached = false;
		/*$this->model->read(
			array('*'),
			array(
				'asin' => $this->asin
			)
			//, array('debug')
		);*/
		
		if($cached) {
			$cached = $cached[0];
			
			$expires = DateTime::createFromFormat(DateTime::ATOM, $cached['datetime_cache_expires']);
			$now = new DateTime('now', new DateTimeZone('UTC'));
			
			if($expires <= $now) { // Cache expired
				$this->setPropertiesFromAPI();
				$this->setCache();
			} else { // Cache still good; read from it
				$this->setPropertiesFromCache($cached);
			}
		} else { // Content is not currently cached
			$this->setPropertiesFromAPI();
			//$this->setCache();
		}
	}
	
	function setCache() {
		$datetime_cache_expires = new DateTime('+24 hours', new DateTimeZone('UTC'));
		$datetime_cache_expires = $datetime_cache_expires->format(DateTime::ATOM);
	
		$cache_created = $this->model->create(
			array(
				'id' => NULL,
				'asin' => $this->asin,
				'img_url' => $this->url,
				'img_w' => $this->width,
				'img_h' => $this->height,
				'detail_page_url' => $this->detailPageUrl,
				'datetime_cache_expires' => $datetime_cache_expires,
			)
		);
		
		if(!$cache_created) {
			return false; // silently fail, not worth throwing exception over
		} else {
			return true; // potential future use
		}
	}
	
	function setPropertiesFromAPI() {
		$amazonEcs = new parent(AZ_APP_ID, AZ_APP_SECRET, 'com', AZ_ASSOCIATE_TAG);
		$image = $amazonEcs->responseGroup('Images')->lookup($this->asin);
		$this->url = $image['Items']['Item'][$this->size . 'Image']['URL'];
		$this->width = $image['Items']['Item'][$this->size . 'Image']['Width']['_'];
		$this->height = $image['Items']['Item'][$this->size . 'Image']['Height']['_'];
		$productSearch = new AmazonProductSearch($this->category);
		$this->detailPageUrl = $productSearch->detailPageFromAsin($this->asin);
		
		if(
			$this->resizeFactor &&
			is_numeric($this->resizeFactor)
		) {
			$this->width = floor($this->width * $this->resizeFactor);
			$this->height = floor($this->height * $this->resizeFactor);
		}
	}
	
	function setPropertiesFromCache($cached) {
		$this->url = $cached['img_url'];
		$this->width = $cached['img_w'];
		$this->height = $cached['img_h'];
		$this->detailPageUrl = $cached['detail_page_url'];	
	}
	
	function getArray() {
		return array(
			'url' => $this->url,
			'width' => $this->width,
			'height' => $this->height,
			'page_url' => $this->detailPageUrl,
		);
	}
	
	function fillArray(&$array) {
		$array['url'] = $this->url;
		$array['width'] = $this->width;
		$array['height'] = $this->height;
		$array['page_url'] = $this->detailPageUrl;
	}
}
?>