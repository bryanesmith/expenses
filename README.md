# expenses

Expense-tracking web application using AngularJS and PHP.

# Pre-reqs

* Apache with `.htaccess` and `mod_rewrite` enabled
* PHP (4.3 and 4.4 tested)
* MySQL 

## Install

*Note*: auth is not provided, so you will need to select an authentication method. An easy option is [Apache password basic auth](http://wiki.apache.org/httpd/PasswordBasicAuth).

1. Create a MySQL database and user for this application, and note the database name, username and password. (User must at least have read and write permissions, though the code below grants all privileges.):

        mysql> CREATE DATABASE `expenses`;
        Query OK, 1 row affected (0.07 sec)

        mysql> GRANT ALL PRIVILEGES ON `expenses`.* TO expenses@localhost IDENTIFIED BY 'mysecretpassword';
        Query OK, 0 rows affected (0.15 sec)

2. Using the newly-created database, run the script in `private/schema.sql`:

        mysql> use expenses;

        mysql> \. private/schema.sql

3. Copy `private/expenses.ini.sample` to `private/expenses.ini`, and update to include the correct database host, database name, database username, database password.

4. Copy the above configuration file `expenses.ini` to a private (non-web accessible) directory on your web host, and update the path to the configuration at `config.php`:
        
        <?php
          // CHANGE: The path to the configuration file
          define( "CONFIG_PATH", "../path/to/expenses.ini" ); 
        ?>

5. Place the contents of `public_html` in any web-accessible directory. (Does not need to be the root of the web directory.)


