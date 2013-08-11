<?php

  require_once 'includes/config.inc.php';

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
  // Source: http://www.nolte-schamm.za.net/2011/05/php-var_dump-into-error-log/
  function var_dump_stderr( $var ) {
    ob_start();
    var_dump($var);
    $contents = ob_get_contents();
    ob_end_clean();
  }

?>
