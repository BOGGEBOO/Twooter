import express from 'express';
import randomId from 'random-id';
import { connectToDatabase, closeDatabaseConnection, getDatabaseConnection } from './mongo.js'

const app = express();

let config = {
    host: 'localhost:27017',
    db: 'lab1'
}

let db
connectToDatabase(config, () => {
    console.log('Connected!')
    db = getDatabaseConnection()
});

// TODO öppna connection till mongodb i varje route, checka med en try-catch om mongo inte nås
// TODO skydd mot injections med https://www.npmjs.com/package/express-mongo-sanitize

async function insert(message_text){
    let doc = { message: `${message_text}`, _id:  randomId(5, 'aA0'), read: false}
    await db.collection('messages').insertOne(doc)
    console.log('1 message has been inserted')
}
async function read(message_id){
    let doc = await db.collection('messages').findOne({'_id' : message_id})
    console.log(`Found: ${JSON.stringify(doc, null, 2)}`) // pretty output
    return doc 
}

async function update(message_id, status){
    await db.collection('messages').updateOne(
        {_id: message_id},
        {
            $set: {read: status }
        }
    );
}

async function find_all(){
    let doc = await db.collection('messages')
    .find({})
    .toArray((err, result) => {
        if (err) throw err;
        return result;
    })
    console.log('All messages have been found')
    // console.log(doc)
    return doc
}
let bad_words = ["järnspikar", "fan", "helvete", "tusan", "stockholm", "danmark", "frankrike",
 "Oliver", "cringe", "tdts04"]
function validate(text){
    let words = text.split(" ");
    for ( let word of words) {
        if (bad_words.includes(word)){
            return false
        }
    }
    return true
}

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Visiting route ${req.path}`);
    next();
})

app.use(express.static('public', {
    maxAge: 5000 // how long should express cache each document?
}));

app.use('/save', (req, res) => {
    if (req.method !== 'POST') res.status(405).send("metoden är FEEEEEEEEEEL");
    else {
        let message = req.body.message;
        if (!validate(message)){
            res.status(200).send("Dåligt meddelande")
        }
        else{
            insert(message);
            res.status(200).send()
        }
        
    }
});

app.use('/flag', (req, res) => {
    if (req.method !== 'POST') res.status(405).send("metoden är FEEEEEEEEEEL");
    else {
        let message_id = req.body.id;
        let status = req.body.read;
        update(message_id, status);
        res.status(200).send()
    }
});

//app.get hanterar inte implicit 405 errors

app.use('/get', async (req, res) => {
    if (req.method !== 'GET') res.status(405).send("metoden är FEEEEEEEEEEL");
    else {
        let message_id = req.query.id;
        console.log(message_id);
        let found_message = await read(message_id);
        if (found_message === null) {
            res.status(400).send("felaktigt id!")
        }
        else {
            res.send(found_message)
        }
    }
});

app.use('/getall', async (req, res) => {
    if (req.method !== 'GET') res.status(405).send("metoden är FEEEEEEEEEEL");
    else{
        let messages = await find_all()
        console.log(messages)
        res.send(messages)  
    }
    
})


// start listening for request on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`App is running, visit http://localhost:${port}`);
})

// app.all('/*', (req, res) => {
//     res.status(404).send('Sidan finns inte, u stooooopid beanana');
//   });

// app.use((req, res, next) => {
//     res.status(500).send("Hoppsan hejsan, nu blev det fel")
// })

