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

Then visit http://127.0.0.1:5500/project/ in a browser

### Testing

Run the tests using: 
```bash
npm run coverage // will start the mocha testing with c8 coverage report
```
If you wish to run the tests again you will need to enter the mongodb database that was created for testing and empty it. To do so start by enterign your mongodb database with:
```bash
mongosh
```
navigate to the testing database:
```bash
use testDB
```
then empty it:
```bash
db.testDB.deleteMany({})
```
You can now run the tests once again, remember that you will have to repeat this process every time you want to run the tests again.