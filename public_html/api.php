<?php

  require_once 'includes/library.inc.php';
  require_once 'includes/request.response.inc.php';
  require_once 'includes/handle.inc.php';

  /*
   * Provides RESTful interface for finances. See .htaccess for rewrite rules.
   *
   * Developed and tested on PHP 4.3 and 4.4.
   *
   * Created: June 15 2013
   */
  
  // If add additional resource, add to this array.
  $types = array( 'expenses', 'categories', 'summaries' );
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - 
  // Go!
  verify_request();
  handle_request( get_req_method(), get_req_resource(), get_req_params() );

?>
