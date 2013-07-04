<?php

  require_once 'includes/library.inc.php';
  require_once 'includes/request.response.inc.php';

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_list_json( $sql, $args ) {
    $json = json_encode( fetchAll( $sql, $args ) );
    respond_json( $json );
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_get_json( $sql, $args ) {

    $result = fetch( $sql, $args );

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
  function convertToMySqlDate( $dateStr ) {
    // Convert MM/DD/YYYY -> YYYY-MM-DD 0000:00:00
    $parts = preg_split("/\//", $dateStr );
    if ( count($parts) != 3 ) {
      respond_bad_request();
    }

    return $parts[2] . '-' . $parts[0] . '-' . $parts[1] . ' 0000:00:00';
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_post_expense() {

    $expense = get_json_decoded_request_payload(); 

    // DEBUG:
    $date = convertToMySqlDate($expense['date']);
    var_dump_stderr( $expense['date'] . ' -> ' . $date );

    $sql = "INSERT INTO `expenses`(`date`, `description`, `cost`, `category_id`) VALUES (?, ?, ?, ?)";
    $args = array( $date , $expense['description'], $expense['cost'], $expense['category_id'] );

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
  function _sth( $sql, $args ) {
    $dbh = get_dbh();

    $sth = $dbh->prepare( $sql );
    $sth->setFetchMode(PDO::FETCH_ASSOC);  
    $sth->execute($args);

    return $sth;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function fetch( $sql, $args = array() ) {
    return _sth($sql, $args)->fetch();
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function fetchAll( $sql, $args = array() ) {
    return _sth($sql, $args)->fetchAll();
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function get_categories() {
    $sql = "SELECT * FROM `categories`";
    return fetchAll( $sql );
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function get_seven_previous_days() {
    $days = array();
    $timestamp = time();
    for ($i = 0 ; $i < 7 ; $i++) {
      array_push( $days, date('Y-m-d', $timestamp) );
      $timestamp -= 24 * 3600; 
    } 
    return $days;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function compareDailyCostTimes( $a, $b ) {
    $aD = $a['date'];
    $bD = $b['date'];
    if ( $aD == $bD ) {
      return 0;
    }

    return $aD < $bD ? -1 : 1;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function fillEmptyDailyCosts( $dailyCosts ) {
    // Step 1: Timestamps are keys, booleans are value.
    $timestamps = array();
    foreach( get_seven_previous_days() as $day ) {
      $timestamp = $day . ' 00:00:00';
      $timestamps[ $timestamp ] = false; 
    }

    // Step 2: find timestamps with values
    foreach ( $dailyCosts as $dailyCost ) {
      $timestamps[ $dailyCost['date'] ] = true;
    }

    var_dump_stderr( $timestamps );

    // Step 3: for any timestamps not found, add 0
    foreach ( $timestamps as $timestamp => $found ) {
      if ( ! $found ) {
        $dailyCost = array( 'cost' => '0', 'date' => $timestamp ); 
        array_push( $dailyCosts, $dailyCost );
      }
    }

    // Step 4: Sort, oldest first
    usort( $dailyCosts, "compareDailyCostTimes" );

    return $dailyCosts;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_get_daily_summary() {
    // TODO: For each category, get:
    //   - Total cost (for convenient comparison client-side)
    //   - Daily cost
    $summaries = array();
    $categories = get_categories();
    foreach ( $categories as $category ) {
      // Get summary of costs
      $sql = "SELECT sum(cost) as cost, date FROM `expenses` WHERE category_id = ? AND date >= DATE_ADD(CURDATE(), INTERVAL -7 DAY)";
      $args = array($category['id']);
      $price = fetch( $sql, $args );
      $total_cost = isset($price['cost']) ? $price['cost'] : "0";

      // Get daily costs
      $sql .= " GROUP BY date";
      $dailyCosts = fetchAll( $sql, $args );

      $summary = array( 
        'id' => $category['id'], 
        'category' => $category['category'],
        'totalCost' => $total_cost, 
        'dailyCosts' => fillEmptyDailyCosts( $dailyCosts ) );

      array_push( $summaries, $summary );
    }

    $json = json_encode( $summaries );
    respond_json( $json );

//    $sql = "SELECT sum(e.cost) as cost, c.category, e.date FROM `expenses` as e, `categories` as c WHERE e.category_id = c.id AND e.date >= DATE_ADD(CURDATE(), INTERVAL -7 DAY) GROUP BY c.id, e.date ORDER BY e.date DESC";
//    $args = array();
//    handle_list_json( $sql, $args ); 
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  function handle_get_summary( $type ) {
    switch ( $type ) {
      case 'daily':
        handle_get_daily_summary();
        break;
      default:
        respond_bad_request();
    }
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
      case 'summaries':
        handle_get_summary( $resource[1] ); 
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
