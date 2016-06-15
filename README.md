# EC2-facer
AWS EC2 server files backup mainly

www.jmjanzen.com:8080 - Development. Testbed for new & experimental features.  
www.jmjanzen.com      - Production.  Typically taken from the latest version of the master branch.

## setup instructions for the novice ubuntu server admin
```css
git clone https://github.com/jm-janzen/EC2-facer        /* clone this repository to your server */
cd EC2-facer                                            /* change directory to cloned repository */
npm install                                             /* install the dependencies facer requires */
nodejs facer.js                                         /* run, then open browser at the specified port,
                                                         * at your server's IP, or DNS */
```
And if you're missing any of the commands above, simply...
```bash
sudo apt-get <package>
``` 

Hopefully this can give you a head start on starting your own web server!
