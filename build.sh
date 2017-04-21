#!/bin/bash
# Set php version through phpenv. 5.3, 5.4, 5.5 & 5.6 available
phpenv local 5.5

nvm install 0.10
npm update
npm install -g grunt-cli
bower update
grunt build

lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; mirror -R src/ /src"
lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; mirror -R dist/ /dist"

lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / index.html"
lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; put -O / .htaccess"

lftp -c "open -u $FTP_USER,$FTP_PASSWORD $FTP_SERVER; set ssl:verify-certificate no; mirror -R no/ /no"