# CHKR
A minimalist checklist web application built on the MEAN stack.

Offers users simple tracking of both daily tasks and longer-term to-dos.

Features:
+ A clean, responsive interface facilitated by Angular & Bootstrap.
+ A simple API for managing users and their tasks.
+ A coloring system for task organization.
+ Automated reset of daily tasks of purging of completed to-dos.
+ A fully automated build & test system through Grunt and Karma.js.
+ A robust and secure MongoDB database for user information.

### Setup
CHKR is designed to be easy to deploy on any Linux system. Production and development environments require standard MongoDB and NodeJS installations

Run `npm install` and `bower install` to collect the necessary server-side and client-side packages, respectively.

### Running
Building, testing, and running CHKR is accomplished easily with Grunt. Simply issue the command `grunt` from the top level of the CHKR directory to build and test your version. If `grunt` is not installed, `sudo apt-get install grunt-cli` or similar may be required.

If everything builds properly, a development server may be started with `grunt serve`. This serves the un-optimized files out of `client/app` to port 9000 (unless another port has been specified in your Node environment.)

Grunt builds the production version of the application in `/dist`. To serve these files, run `NODE_ENV=production npm start` or a similar command in `/dist`.
