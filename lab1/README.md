# README

## Usage
This program makes use of a MongoDb Node Driver local server, can be dowloaded from: https://www.mongodb.com/docs/manual/administration/install-community/#std-label-install-mdb-community-edition Follow the instructions on the website.

Get the connection string for the MongoDB database using:
```bash
mongosh // to enter the database
db.getMongo() // prints the connection string
```

Take the connection string and replace the current string in the uri variable in the app.js file 

First start the MongoDB database server using:
```bash
systemctl start mongod
```
Then start the express server with:
```bash
node app.js
```

Then visit http://localhost:3000 in a browser

This program uses the second given specification for getting and storing messages.

Run the tests using: 
```bash
npm run coverage // will start the mocha testing with c8 coverage report
```
