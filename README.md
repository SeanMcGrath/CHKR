# CHKR
A minimalist checklist web application built on the MEAN stack.

Offers users simple tracking of both daily tasks and longer-term to-dos.

Features:
+ A clean, responsive interface facilitated by Angular & Bootstrap.
+ A simple API for managing users and their tasks.
+ A coloring system for task organization.
+ Automated reset of daily tasks and purging of completed to-dos.
+ A fully automated build & test system through Grunt and Karma.js.
+ A robust and secure MongoDB database for user information.

### Setup
CHKR is designed to be easy to deploy on any Linux system. Production and development environments require standard MongoDB and NodeJS installations. Also required are:

Ruby: `sudo apt-get install ruby-full`
Sass: `sudo su -c "gem install sass"`
Grunt: `npm install -g grunt-cli`

Run `npm install` and `bower install` to collect the necessary server-side and client-side packages, respectively.

### Running
Building, testing, and running CHKR is accomplished easily with Grunt. Simply issue the command `grunt` from the top level of the CHKR directory to build and test your version.

If everything builds properly, a development server may be started with `grunt serve`. This serves the un-optimized files out of `client/app` to port 9000 (unless another port has been specified in your Node environment.)

Grunt builds the production version of the application in `/dist`. To serve these files, run `NODE_ENV=production npm start` or a similar command in `/dist`.

### Development

The current release version of CHKR is maintained on branch `master`. Pushes to this branch should be restricted to critical bugfixes.

Feature development should be done on branch `development`. Further sub-branches may be forked and merged into `development` as needed.
