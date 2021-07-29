## Deploy Approachs

- mod_php  
  - PHP is integrated into the web-serverno extra PHP-Processeverything is handled by the Apache processefficient
- CGI
  - Common Gateway Interface
  - run server-side script(non't only PHP) to genurate dynamic web content
  - start an extra PHP process for each request
  - inefficient
- FastCGI
  - a better CGI implement for PHP
  - use "ready mode" PHP interpreter instance, get the PHP files paased on to be handled
  - contains the security advantages from CGI  and then efficient like mod_php
- FPM
  - PHP-FastCGI Process Manager
  - an alternative to the FastCGI implement
  - there is always a "parallel" PHP-FPM Process which is connected to the web-server process

## FPM Deployment

- Install PHP 
- Setup FPM
- Configure Apache: proxy to FPM



### Install PHP 

```shell
# dependents
sudo yum install autoconf libtool re2c bison libxml2-devel bzip2-devel libcurl-devel libpng-devel libicu-devel gcc-c++ libmcrypt-devel libwebp-devel libjpeg-devel openssl-devel -y
# dependent: oniguruma
yum search onigsudo yum install oniguruma.x86_64 oniguruma-devel.x86_64 -y

# configure and make
./configure --prefix=/usr/local/php --enable-fpm --disable-short-tags --with-openssl --with-pcre-regex --with-pcre-jit --with-zlib --enable-bcmath --with-bz2 --enable-calendar --with-curl --enable-exif --with-gd --enable-intl --enable-mbstring --with-mysqli --enable-pcntl --with-pdo-mysql --enable-soap --enable-sockets --with-xmlrpc --enable-zip --with-webp-dir --with-jpeg-dir --with-png-dir
make clean && make

# make install
sudo make install

# install details:
[pang@pang php-7.4.21]$ sudo make install
[sudo] password for pang:
Installing shared extensions:     /usr/local/php/lib/php/extensions/no-debug-non-zts-20190902/
Installing PHP CLI binary:        /usr/local/php/bin/
Installing PHP CLI man page:      /usr/local/php/php/man/man1/
Installing PHP FPM binary:        /usr/local/php/sbin/
Installing PHP FPM defconfig:     /usr/local/php/etc/
Installing PHP FPM man page:      /usr/local/php/php/man/man8/
Installing PHP FPM status page:   /usr/local/php/php/php/fpm/
Installing phpdbg binary:         /usr/local/php/bin/
Installing phpdbg man page:       /usr/local/php/php/man/man1/
Installing PHP CGI binary:        /usr/local/php/bin/
Installing PHP CGI man page:      /usr/local/php/php/man/man1/
Installing build environment:     /usr/local/php/lib/php/build/
Installing header files:          /usr/local/php/include/php/
Installing helper programs:       /usr/local/php/bin/
  program: phpize
  program: php-config
Installing man pages:             /usr/local/php/php/man/man1/
  page: phpize.1
  page: php-config.1
/home/pang/Downloads/PHP/php-7.4.21/build/shtool install -c ext/phar/phar.phar /usr/local/php/bin/phar.phar
ln -s -f phar.phar /usr/local/php/bin/phar
Installing PDO headers:           /usr/local/php/include/php/ext/pdo/
```



### Setup FPM

- /usr/local/php/etc
  - php-fpm.conf
  - php-fpm.d/www.conf
- /usr/local/php/lib/php.ini
- /etc/init.d/php-fpm

```shell
cd /usr/local/php/etc
cp php-fpm.conf.default php-fpm.conf
cd php-fpm.d
cp www.conf.default www.conf

cp /home/pang/Downloads/PHP/php-7.4.21/php.ini-development /usr/local/php/lib/php.ini
cp /home/pang/Downloads/PHP/php-7.4.21/sapi/fpm/init.d.php-fpm /etc/init.d/php-fpm

cd /var/www
mkdir htdocs
vi htdocs/test.php

service start php-fpm
```

/var/www/htdocs/test.php:

```php
<?php

phpinfo();
```




### Configure Apache: proxy to FPM

`vi /etc/httpd/conf/httpd.conf`, append:

```ini
# Translate
# /xxx.php 
# to 
# fcgi://127.0.0.1:9000/var/www/htdocs/xxx.php
<LocationMatch "^/(.*\.php(/.*)?)$">
    ProxyPass fcgi://127.0.0.1:9000/var/www/htdocs/$1
</LocationMatch>
```

test:  `curl 127.0.0.1/test.php`



## References:

https://blog.layershift.com/which-php-mode-apache-vs-cgi-vs-fastcgi/

https://www.php.net/downloads.phphttps://blacksaildivision.com/php-install-from-source

