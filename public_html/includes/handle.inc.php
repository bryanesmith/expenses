<?php

  require_once 'includes/library.inc.php';
  require_once 'includes/request.response.inc.php';

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


?>