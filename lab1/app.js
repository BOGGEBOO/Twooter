import express from 'express';
import randomId from 'random-id';
import { MongoClient } from 'mongodb';
import sanitize from 'mongo-sanitize';

const app = express();

let config = {
    host: 'localhost:27017',
    db: 'lab1'
}

let uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1"

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

app.use('/save', async (req, res) => {
    try {
        let client = new MongoClient(uri)
        let db = client.db('lab1')

        if (req.method !== 'POST') res.status(405).send("metoden är FEEEEEEEEEEL");
        else {
            let message_text = sanitize(req.body.message);
            if (!validate(message_text)){
                res.status(200).send("Dåligt meddelande")
            }
            else{
                let doc = { message: `${message_text}`, _id:  randomId(5, 'aA0'), read: false}
                await db.collection('messages').insertOne(doc)
                console.log('1 message has been inserted')
                res.status(200).send()
            }
        } 
    } catch(err) {
        console.log(err)
        res.status(500).send()
    }
});

app.use('/flag', async (req, res) => {
    try {
        let client = new MongoClient(uri)
        let db = client.db('lab1')

        if (req.method !== 'POST') res.status(405).send("metoden är FEEEEEEEEEEL");
        else {
            let message_id = req.body.id;
            let status = req.body.read;
            let update_status = await db.collection('messages').updateOne(
                {_id: message_id},
                {
                    $set: {read: status }
                }
            );
            if (update_status.matchedCount !== 1){
                res.status(400).send("Felaktigt id!")
            }
            else{
                res.status(200).send()

            }
        }
    } catch(err){
        console.log(err)
        res.status(500).send()
    }
    
});

//app.get hanterar inte implicit 405 errors

app.use('/get', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('lab1')

        if (req.method !== 'GET') res.status(405).send("metoden är FEEEEEEEEEEL");
        else {
            let message_id = req.query.id;
            console.log(message_id);
            let find_message = async () => {
                let doc = await db.collection('messages').findOne({'_id' : message_id})
                console.log(`Found: ${JSON.stringify(doc, null, 2)}`) // pretty output
                return doc
            }
            let found_message = await find_message()
            if (found_message === null) {
                res.status(400).send("felaktigt id!")
            }
            else {
                res.send(found_message)
            }
        }
    } catch(err){
        console.log(err)
        res.status(500).send()
    }
    
});

app.use('/getall', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('lab1')

        if (req.method !== 'GET') res.status(405).send("metoden är FEEEEEEEEEEL");
        else{
            let get_messages = async () => {
                let doc = await db.collection('messages')
                .find({})
                .toArray((err, result) => {
                    if (err) throw err;
                    return result;
                })
                console.log('All messages have been found')
                return doc
            }
            let messages = await get_messages()
            console.log(messages)
            res.send(messages)  
        }
    } catch(err){
        console.log(err)
        res.status(500).send()
    }
    
    
})


// start listening for request on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`App is running, visit http://localhost:${port}`);
})


export default app
