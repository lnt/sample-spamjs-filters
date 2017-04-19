#!/bin/bash
# Set php version through phpenv. 5.3, 5.4, 5.5 & 5.6 available
phpenv local 5.5
# Install extensions through Pecl
# yes yes | pecl install memcache
# Install dependencies through Composer
#composer install --prefer-dist --no-interaction
#composer update

lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; mirror -R app/ /app"
lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; mirror -R lib/ /lib"
lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; mirror -R api/ /api"
lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; mirror -R static/ /static"

nvm install 0.10
npm update
npm install -g grunt-cli
bower update
grunt build

lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; mirror -R src/ /src"
lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; mirror -R dist/ /dist"

lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / index.html"
lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / .htaccess"

#lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / sitemap.xml"
#lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / rss.xml"
#lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / sitemap.txt"
#lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / sitemap.htm"
#lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / errors.htm"
#lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / robots.txt"
#lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / editor.html"


#curl "https://invite.parichya.com/json/build?RX_MODE_DEBUG=true&RX_MODE_BUILD=1"

lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; mirror -R no/ /no"