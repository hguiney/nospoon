<?php
header('Content-Type: text/html; charset=utf-8');
$url = 'http://db.nospoon.tv/atom/query/users';
$headers = array('Content-Type: application/xquery');
$content = file_get_contents('all-feeds.xq');

// Use curl to post to your blog.
$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
curl_setopt($ch, CURLOPT_POST, 1);
curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
curl_setopt($ch, CURLINFO_HEADER_OUT, 1);
curl_setopt($ch, CURLOPT_VERBOSE, 1);
curl_setopt($ch, CURLOPT_POSTFIELDS, $content);

$data = curl_exec($ch);
echo '<pre>';
print_r(curl_getinfo($ch));

if (curl_errno($ch)) {
	print curl_error($ch);
} else {
	curl_close($ch);
}


// $data contains the result of the post...

echo htmlentities($data);
echo '</pre>';
?>