<?php
define('AZ_APP_ID', 'AKIAIH55RAJODGWTXQLQ');
define('AZ_APP_SECRET', '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');
define('AZ_ASSOCIATE_TAG', 'nospotv-20');
require($_SERVER['DOCUMENT_ROOT'] . 'includes/aws/ecs/lib/AmazonECS.class.php');
class AmazonProductSearch extends AmazonECS {
	protected $category;
    protected $asin;
    protected $detailPageUrl;
    protected $ecs;

    function __get($name) {
        return $this->$name;
    }

    function __construct($category) {
        $this->ecs = new parent(AZ_APP_ID, AZ_APP_SECRET, 'com', AZ_ASSOCIATE_TAG);
		$this->category = $category;
    }

    function searchByAsin($asin) {
        $search = $this->ecs->responseGroup('Small')->category($this->category)->search($asin);

        $this->asin = $asin;

        if(isset($search['Items']['Item']['DetailPageURL'])) {
            $this->detailPageUrl = $search['Items']['Item']['DetailPageURL'];
        } elseif(isset($search['Items']['Item'][0]['DetailPageURL'])) {
            $this->detailPageUrl = $search['Items']['Item'][0]['DetailPageURL'];
        } else {
            return false;
        }

        return $this;
    }

    function detailPageFromAsin($asin) {
        return $this->searchByAsin($asin)->detailPageUrl;
    }
}
?>