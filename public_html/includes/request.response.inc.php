<?php

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  // Polyfill for http_response_code (for PHP 4.3)
  // Source: http://www.php.net/manual/en/function.http-response-code.php#107261
  if (!function_exists('http_response_code')) {
    function http_response_code($code = NULL) {
      if ($code !== NULL) {
        switch ($code) {
          case 100: $text = 'Continue'; break;
          case 101: $text = 'Switching Protocols'; break;
          case 200: $text = 'OK'; break;
          case 201: $text = 'Created'; break;
          case 202: $text = 'Accepted'; break;
          case 203: $text = 'Non-Authoritative Information'; break;
          case 204: $text = 'No Content'; break;
          case 205: $text = 'Reset Content'; break;
          case 206: $text = 'Partial Content'; break;
          case 300: $text = 'Multiple Choices'; break;
          case 301: $text = 'Moved Permanently'; break;
          case 302: $text = 'Moved Temporarily'; break;
          case 303: $text = 'See Other'; break;
          case 304: $text = 'Not Modified'; break;
          case 305: $text = 'Use Proxy'; break;
          case 400: $text = 'Bad Request'; break;
          case 401: $text = 'Unauthorized'; break;
          case 402: $text = 'Payment Required'; break;
          case 403: $text = 'Forbidden'; break;
          case 404: $text = 'Not Found'; break;
          case 405: $text = 'Method Not Allowed'; break;
          case 406: $text = 'Not Acceptable'; break;
          case 407: $text = 'Proxy Authentication Required'; break;
          case 408: $text = 'Request Time-out'; break;
          case 409: $text = 'Conflict'; break;
          case 410: $text = 'Gone'; break;
          case 411: $text = 'Length Required'; break;
          case 412: $text = 'Precondition Failed'; break;
          case 413: $text = 'Request Entity Too Large'; break;
          case 414: $text = 'Request-URI Too Large'; break;
          case 415: $text = 'Unsupported Media Type'; break;
          case 500: $text = 'Internal Server Error'; break;
          case 501: $text = 'Not Implemented'; break;
          case 502: $text = 'Bad Gateway'; break;
          case 503: $text = 'Service Unavailable'; break;
          case 504: $text = 'Gateway Time-out'; break;
          case 505: $text = 'HTTP Version not supported'; break;
          default:
            exit('Unknown http status code "' . htmlentities($code) . '"');
          break;
        }

        $protocol = (isset($_SERVER['SERVER_PROTOCOL']) ? $_SERVER['SERVER_PROTOCOL'] : 'HTTP/1.0');

        header($protocol . ' ' . $code . ' ' . $text);

        $GLOBALS['http_response_code'] = $code;
      } else {
          $code = (isset($GLOBALS['http_response_code']) ? $GLOBALS['http_response_code'] : 200);
      }
      return $code;
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  function respond_not_found() {
    http_response_code(404);
    exit;
  } 

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  function respond_bad_request() {
    http_response_code(400);
    exit;
  } 

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  function respond_not_implemented() {
    http_response_code(501);
    exit;
  } 

  // - - - - - - - - - - - - - - - - - - - - - - - - - - -
  function respond_json( $json ) {
    header('Content-Type: application/json');
    print $json;
    exit;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  $_req_params = NULL;
  function get_req_params() {
    global $_req_params;
    if ( ! isset( $_req_params ) ) {
      $_req_params = [];
      foreach( $_GET as $key => $val ) {
        if ( $key != 'path' ) {
          $_req_params[$key] = $val;
        }
      }
    }
  
    return $_req_params;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  $_req_resource = NULL;
  function get_req_resource() {
    global $_req_resource;
    if ( ! isset( $_req_resource ) ) {
      $_req_resource = explode( '/', trim( get_req_path(), '/' ) );
    }
    return $_req_resource;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function get_req_path() {
    return $_GET["path"];
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function get_req_method() {
    return $_SERVER["REQUEST_METHOD"];
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function get_json_decoded_request_payload() {
    $json = file_get_contents('php://input');
    return json_decode($json, true);
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function verify_request() {

    /**
     * Potential request formats:
     *  1. /{resource}
     *  2. /{resource}/{id}
     *  3. /summaries/{period}
     *  4. /{action}/{resource}
     *  5. /{action}/{resource}/{id}
     *
     * Where:
     *  - {resource}: expenses, categories
     *  - {id}: numeric
     *  - {period}: daily
     *  - {action}: delete, put
     */
    
    // TODO: Implement
    return true;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  // Too many edge cases for verifying requests like this...
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 
//  function verify_request() {
//    global $types;
//
//    $resource = get_req_resource();
//
//    # CHECK: Should have 1 or 2 parts
//    $count = count( $resource );
//    switch ( $count ) {
//
//      case 1: # nothing
//        break;
//
//      # CHECK: If second argument, must be numeric
//      case 2:
//        # NOTE: /summaries/daily violates this check
//#        $id = $resource[1];
//#        if (! is_numeric( $id ) ) {
//#          respond_bad_request();
//#        }
//        break;
//
//      default:
//        respond_bad_request();
//    }
//
//    # CHECK: Recognized part
//    $type = $resource[0];
//    if ( ! in_array( $type, $types ) ) {
//      respond_bad_request(); 
//    }
//
//  } # verify_request

?>
