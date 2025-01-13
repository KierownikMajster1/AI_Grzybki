<?php
function fetchData($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_TIMEOUT, 30);

    // Wyłączenie weryfikacji certyfikatów SSL
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
    curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);

    $response = curl_exec($ch);

    if (curl_errno($ch)) {
        echo "Błąd cURL: " . curl_error($ch) . "\n";
        curl_close($ch);
        return null;
    }

    curl_close($ch);
    return json_decode($response, true);
}

?>
