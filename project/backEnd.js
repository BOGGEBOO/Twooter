import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import sanitize from 'mongo-sanitize';


//replace the string with own connection string
let uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1"

const app = express();

app.use(express.json());

app.use((req, res, next) => {
    console.log(`Visiting route ${req.path}`);
    next();
})

app.use(cors({
    origin: 'http://127.0.0.1:5500', // Allow only this origin
    methods: ['GET', 'POST']
  }));

app.use(express.static('public', {
    maxAge: 5000 // how long should express cache each document?
}));

app.post('/signin', async (req, res) => {
    
    try {
        let client = new MongoClient(uri)
        let db = client.db('project')

        let data = req.body
        let username = sanitize(data.username)
        let doc = await db.collection('users').findOne({'name': username})
        if(doc != null){
            res.status(200).send(JSON.stringify({success: false}))
        }
        else{
            let user = {
                name: username, 
                pwd: data.password, 
                pendingReq: [], 
                friends: [], 
                messages: []
            }
            await db.collection('users').insertOne(user)
            
            console.log('User created')
            res.status(200).send(JSON.stringify({success: true}))
        }        

    } catch(err){
        console.log(err)
        res.status(500).send(JSON.stringify({success: false}))
    }
})

app.post('/login', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('project')


        let data = req.body
        let username = sanitize(data.username)
        let doc = await db.collection('users').findOne({'name': username})
        
        if(data.password == doc.pwd){
            
            res.status(200).send(JSON.stringify({success: true}))
        }
        else{
            res.status(200).send(JSON.stringify({success: false}))
        }

    }catch(err){
        console.log(err)
        res.status(500).send()
    }
})

app.get('/getUsers', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('project')

        let users = await db.collection('users').find({})
        .toArray((err, result) => {
            if(err) throw err;
            return result;
        })
        let userNames = []
        for(const user of users){
            userNames.push(user['name'])
        }
        res.status(200).send(JSON.stringify({userNames: userNames}))

    }catch(err){
        console.log(err)
        res.status(500).send()
    }
})

app.post('/sendFriend', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('project')

        let data = req.body
        let doc = await db.collection('users').findOne({'name': data.receiver})
        if(!(data.sender in doc['pendingReq'])) {
            await db.collection('users').updateOne(
                {'name': data.receiver},
                { $push: {'pendingReq': data.sender} }
            )
            res.status(200).send(JSON.stringify({success: true}))
        }
        else{
            res.status(200).send(JSON.stringify({success: false}))
        }

        
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
})

app.post('/accFriend', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('project')
        
        let data = req.body
        
        await db.collection('users').updateOne(
            {'name': data.sender},
            {$push: {'friends': data.receiver}
        }
        )

        await db.collection('users').updateOne(
            {'name': data.sender},
            {$pull: {'pendingReq': data.receiver}
        }
        )

        await db.collection('users').updateOne(
            {'name': data.receiver},
            {$push: {'friends': data.sender}}
        )

        await db.collection('users').updateOne(
            {'name': data.receiver},
            {$pull: {'pendingReq': data.sender}}
        )
        
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
})

app.get('/getMessages', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('project')

        let data = req.query.name
        
        let doc = await db.collection('users').findOne({'name': data})
        res.status(200).send(JSON.stringify({messages: doc['messages']}))
        
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
})



// start listening for request on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`App is running, visit http://localhost:${port}`);
})