<?php

  require 'config.php';

  /*
   * Provides RESTful interface for finances. See .htaccess for rewrite rules.
   *
   * Developed and tested on PHP 4.3 and 4.4.
   *
   * Created: June 15 2013
   */
  
  // If add additional resource, add to this array.
  $types = array( 'expenses', 'categories' );

  // Constants for this request
  define( "PATH"  , $_GET["path"] );
  define( "METHOD", $_SERVER["REQUEST_METHOD"] );
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  $_config = NULL;
  function get_config() {
    global $_config;
    if ( ! isset( $_config ) ) {
      $_config = parse_ini_file( CONFIG_PATH );
    }

    return $_config;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  $_dbh = NULL;
  function get_dbh() {

    global $_dbh;

    if ( ! isset( $_dbh ) ) {

      $config = get_config();

      $host   = $config[ 'mysql_host' ];
      $dbname = $config[ 'mysql_dbname' ];
      $user   = $config[ 'mysql_user' ];
      $pass   = $config[ 'mysql_password' ];

      $str = "mysql:host=${host};dbname=${dbname}";
      $_dbh = new PDO( $str, $user, $pass );

    }

    return $_dbh;
  }
   
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
  $_req_resource = NULL;
  function get_req_resource() {
    global $_req_resource;
    if ( ! isset( $_req_resource ) ) {
      $_req_resource = explode( '/', trim( PATH, '/' ) );
    }
    return $_req_resource;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function get_json_decoded_request_payload() {
    $json = file_get_contents('php://input');
    return json_decode($json, true);
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_list_json( $sql, $args ) {
    $dbh = get_dbh();

    $sth = $dbh->prepare( $sql );
    $sth->setFetchMode(PDO::FETCH_ASSOC);  
    $sth->execute($args);

    $json = json_encode( $sth->fetchAll() );
    respond_json( $json );
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_get_json( $sql, $args ) {
    $dbh = get_dbh();

    $sth = $dbh->prepare( $sql );
    $sth->setFetchMode(PDO::FETCH_ASSOC);  
    $sth->execute($args);

    $result = $sth->fetch();

    if ( $result ) {
      $json = json_encode( $result );
      respond_json( $json );
    } else {
      respond_not_found();
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_post_json( $sql, $args, $resource ) {

    try {    
      $dbh = get_dbh();
      $sth = $dbh->prepare( $sql );
      $sth->execute($args);
    } catch ( Exception $e ) {
      respond_bad_request();
    }

    // For response, retrieve newly-created resource
    $resource['id'] = $dbh->lastInsertId(); 
    $json = json_encode( $resource ); 
    respond_json( $json ); 
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_list_expenses() {
    $sql = "SELECT * FROM `expenses`";
    $args = array();
    handle_list_json( $sql, $args ); 
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_get_expense( $id ) {
    $sql = "SELECT * FROM `expenses` WHERE `id` = ?";
    $args = array( $id );
    handle_get_json( $sql, $args ); 
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_list_categories() {
    $sql = "SELECT * FROM `categories`";
    $args = array();
    handle_list_json( $sql, $args ); 
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_get_category( $id ) {
    $sql = "SELECT * FROM `categories` WHERE `id` = ?";
    $args = array( $id );
    handle_get_json( $sql, $args ); 
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  // Source: http://www.nolte-schamm.za.net/2011/05/php-var_dump-into-error-log/
  function var_dump_stderr( $var ) {
    ob_start();
    var_dump($var);
    $contents = ob_get_contents();
    ob_end_clean();
    error_log($contents);
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_post_expense() {

    $expense = get_json_decoded_request_payload(); 

    // DEBUG:
    var_dump_stderr( $expense );

    $sql = "INSERT INTO `expenses`(`date`, `description`, `cost`, `category_id`) VALUES (?, ?, ?, ?)";
    $args = array( $expense['date'] . ' 00:00:00', $expense['description'], $expense['cost'], $expense['category_id'] );

    handle_post_json( $sql, $args, $expense );
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_post_category() {

    $category = get_json_decoded_request_payload(); 

    $sql = "INSERT INTO `categories`(`category`) VALUES (?)";
    $args = array( $category['category'] );

    handle_post_json( $sql, $args, $category );
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_get_request( $resource ) {
    $type = $resource[0];
    $count = count( $resource );
    switch ( $type ) {
      case 'expenses':
          if ( $count == 1 ) {
            handle_list_expenses();
          } else if ( $count == 2 ) {
            handle_get_expense( $resource[1] );
          }
          break;
      case 'categories':
          if ( $count == 1 ) {
            handle_list_categories();
          } else if ( $count == 2 ) {
            handle_get_category( $resource[1] );
          }
          break;
    }
  } // handle_get_request

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_post_request( $resource ) {
    $type = $resource[0];
    switch ( $type ) {
      case 'expenses':
          handle_post_expense();
          break;
      case 'categories':
          handle_post_category();
          break;
    }
  } 
 
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_put_request( $resource ) {
    respond_not_implemented();
  } 

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_delete_request( $resource ) {
    respond_not_implemented();
  } 

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_request( $resource, $method ) { 
    switch ( $method ) {
      case "POST":
          handle_post_request( $resource );
          break;
      case "GET":
          handle_get_request( $resource );
          break;
      case "PUT":
          handle_put_request( $resource );
          break;
      case "DELETE":
          handle_delete_request( $resource );
          break;
    }
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function verify_request() {
    global $types;

    $resource = get_req_resource();

    # CHECK: Should have 1 or 2 parts
    $count = count( $resource );
    switch ( $count ) {

      case 1: # nothing
        break;

      # CHECK: If second argument, must be numeric
      case 2:
        $id = $resource[1];
        if (! is_numeric( $id ) ) {
          respond_bad_request();
        }
        break;

      default:
        respond_bad_request();
    }

    # CHECK: Recognized part
    $type = $resource[0];
    if ( ! in_array( $type, $types ) ) {
      respond_bad_request(); 
    }

  } # verify_request

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  // Go!
  verify_request();
  handle_request( get_req_resource(), METHOD );

?>
