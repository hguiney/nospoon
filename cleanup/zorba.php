<html>
<title>Zorba test</title>
<body>
<?php
    // include Zorba API
    require_once 'zorba_api_wrapper.php';
    // create Zorba instance in memory
    $ms = InMemoryStore::getInstance();
    $zorba = Zorba::getInstance($ms);

    try {
        // create and compile query string<
        $queryStr = '1+2';
        $query = $zorba->compileQuery($queryStr);

        // execute query and display result
        $result = $query->execute();
        echo $result;
        // clean up
        $query->destroy();
        $zorba->shutdown();
        InMemoryStore::shutdown($ms);
    } catch (Exception $e) {
        die('ERROR:' . $e->getMessage());
    }
?>
</body>
</html>
