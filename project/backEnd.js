import express from 'express';
import { MongoClient } from 'mongodb';
import cors from 'cors';
import sanitize from 'mongo-sanitize';
import randomId from 'random-id';


//replace the string with own connection string
let uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.2" // alex
// let uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1" // oliver

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
        if(doc == null) {
            res.status(200).send(JSON.stringify({success: false}))
        }
        else{
            if(data.password == doc.pwd){
            
                res.status(200).send(JSON.stringify({success: true}))
            }
            else{
                res.status(200).send(JSON.stringify({success: false}))
            }
        }
        

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
        console.log(data.sender)
        let doc = await db.collection('users').findOne({'name': data.receiver})
        if((doc['pendingReq'].includes(data.sender) == false) && (doc['friends'].includes(data.sender) == false)) {
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

        let sender = await db.collection('users').findOne({'name': data.sender})
        
        if (sender['friends'].includes(data.receiver) == true) {
            res.status(200).send(JSON.stringify({success: false}))
        }
        else{
            await db.collection('users').bulkWrite([
                { updateOne: {
                    filter: {'name': data.sender},
                    update: {$push: {'friends': data.receiver}}
                }},
                { updateOne: {
                    filter: {'name': data.receiver},
                    update: {$push: {'friends': data.sender}}
                }},
                { updateOne: {
                    filter: {'name': data.sender},
                    update: {$pull: {'pendingReq': data.receiver}}
                }},
                { updateOne: {
                    filter: {'name': data.receiver},
                    update: {$pull: {'pendingReq': data.sender}}
                }},
            ])
            
            res.status(200).send(JSON.stringify({success: true}))
        }
        
        
        
    }catch(err){
        console.log(err)
        res.status(500).send()
    }
})

app.get('/getFriends', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('project')

        let data = req.query.name
        console.log(data)
        let doc = await db.collection('users').findOne({'name': data})
        res.status(200).send(JSON.stringify({friends: doc['friends']}))
        
        
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

app.post('/addMessage', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('project')

        let data = req.body
        if(data.message.length > 140 || data.message.length < 1) {
            res.status(200).send(JSON.stringify({success: false}))
        }
        else {
            let id = randomId(5, 'aA0')
            let message = {
                user: data.poster,
                message: data.message,
                id: id,
                date: Date.now()
            }
            
            await db.collection('users').updateOne(
                {'name': data.profile},
                {$push: {'messages': message}}
            )
            res.status(200).send(JSON.stringify({id: id, success: true}))
        }  
        
    }catch(err){
        console.log(err)
        res.status(500).send(JSON.stringify({success: false}))
    }
})

app.get('/findUsers', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('project')

        let data = req.query.name
        let re = RegExp(data)
        let users = await db.collection('users').find({ "name": {$regex: re}})
        .toArray((err, result) => {
            if(err) throw err;
            return result;
        })
        let userNames = []
        for(const user of users){
            userNames.push(user['name'])
        }
        console.log(userNames)
        res.status(200).send(JSON.stringify({userNames: userNames}))

        
    }catch(err){
        console.log(err)
        res.status(500).send(JSON.stringify({success: false}))
    }
})

app.get('/getPending', async (req, res) => {
    try{
        let client = new MongoClient(uri)
        let db = client.db('project')

        let data = req.query.name
        let doc = await db.collection('users').findOne({'name': data})
        res.status(200).send(JSON.stringify({reqs: doc['pendingReq']}))
        
    }catch(err){
        console.log(err)
        res.status(500).send(JSON.stringify({success: false}))
    }
})



// start listening for request on port 3000
const port = 3000;
app.listen(port, () => {
    console.log(`App is running, visit http://localhost:${port}`);
})

export default app

// import express from 'express';
// import { MongoClient } from 'mongodb';
// import cors from 'cors';
// import sanitize from 'mongo-sanitize';
// import randomId from 'random-id';


// //replace the string with own connection string
// let uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.2" // alex
// // let uri = "mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.3.1" // oliver

// const app = express();

// app.use(express.json());

// app.use((req, res, next) => {
//     console.log(`Visiting route ${req.path}`);
//     next();
// })

// app.use(cors({
//     origin: 'http://127.0.0.1:5500', // Allow only this origin
//     methods: ['GET', 'POST']
//   }));

// app.use(express.static('public', {
//     maxAge: 5000 // how long should express cache each document?
// }));

// app.post('/signin', async (req, res) => {
    
//     try {
//         let client = new MongoClient(uri)
//         let db = client.db('project')

//         let data = req.body
//         let username = sanitize(data.username)
//         let doc = await db.collection('users').findOne({'name': username})
//         if(doc != null){
//             res.status(200).send(JSON.stringify({success: false}))
//         }
//         else{
//             let user = {
//                 name: username, 
//                 pwd: data.password, 
//                 pendingReq: [], 
//                 friends: [], 
//                 messages: []
//             }
//             await db.collection('users').insertOne(user)
            
//             console.log('User created')
//             res.status(200).send(JSON.stringify({success: true}))
//         }        

//     } catch(err){
//         console.log(err)
//         res.status(500).send(JSON.stringify({success: false}))
//     }
// })

// app.post('/login', async (req, res) => {
//     try{
//         let client = new MongoClient(uri)
//         let db = client.db('project')


//         let data = req.body
//         let username = sanitize(data.username)
//         let doc = await db.collection('users').findOne({'name': username})
        
//         if(data.password == doc.pwd){
            
//             res.status(200).send(JSON.stringify({success: true}))
//         }
//         else{
//             res.status(200).send(JSON.stringify({success: false}))
//         }

//     }catch(err){
//         console.log(err)
//         res.status(500).send()
//     }
// })

// app.post('/sendFriend', async (req, res) => {
//     try{
//         let client = new MongoClient(uri)
//         let db = client.db('project')

//         let data = req.body
//         console.log(data.sender)
//         let doc = await db.collection('users').findOne({'name': data.receiver})
//         if((doc['pendingReq'].includes(data.sender) == false) && (doc['friends'].includes(data.sender) == false)) {
//             await db.collection('users').updateOne(
//                 {'name': data.receiver},
//                 { $push: {'pendingReq': data.sender} }
//             )
//             res.status(200).send(JSON.stringify({success: true}))
//         }
//         else{
//             res.status(200).send(JSON.stringify({success: false}))
//         }

        
//     }catch(err){
//         console.log(err)
//         res.status(500).send()
//     }
// })

// app.post('/accFriend', async (req, res) => {
//     try{
//         let client = new MongoClient(uri)
//         let db = client.db('project')
        
//         let data = req.body

//         let sender = await db.collection('users').findOne({'name': data.sender})
//         if (sender['friends'].includes(data.receiver) == true) {
//             res.status(200).send(JSON.stringify({success: false}))
//         }
//         else{
//             await db.collection('users').bulkWrite([
//                 { updateOne: {
//                     filter: {'name': data.sender},
//                     update: {$push: {'friends': data.receiver}}
//                 }},
//                 { updateOne: {
//                     filter: {'name': data.receiver},
//                     update: {$push: {'friends': data.sender}}
//                 }},
//                 { updateOne: {
//                     filter: {'name': data.sender},
//                     update: {$pull: {'pendingReq': data.receiver}}
//                 }},
//                 { updateOne: {
//                     filter: {'name': data.receiver},
//                     update: {$pull: {'pendingReq': data.sender}}
//                 }},
//             ])
            
//             res.status(200).send(JSON.stringify({success: true}))
//         }
        
//     }catch(err){
//         console.log(err)
//         res.status(500).send()
//     }
// })

// app.get('/getFriends', async (req, res) => {
//     try{
//         let client = new MongoClient(uri)
//         let db = client.db('project')

//         let data = req.query.name
//         console.log(data)
//         let doc = await db.collection('users').findOne({'name': data})
//         res.status(200).send(JSON.stringify({friends: doc['friends']}))
        
        
//     }catch(err){
//         console.log(err)
//         res.status(500).send()
//     }
// })

// app.get('/getMessages', async (req, res) => {
//     try{
//         let client = new MongoClient(uri)
//         let db = client.db('project')

//         let data = req.query.name
        
//         let doc = await db.collection('users').findOne({'name': data})
//         res.status(200).send(JSON.stringify({messages: doc['messages']}))
        
//     }catch(err){
//         console.log(err)
//         res.status(500).send()
//     }
// })

// app.post('/addMessage', async (req, res) => {
//     try{
//         let client = new MongoClient(uri)
//         let db = client.db('project')

//         let data = req.body
//         if(data.message.length > 140 || data.message.length < 1) {
//             res.status(200).send(JSON.stringify({success: false}))
//         }
        
//         let id = randomId(5, 'aA0')
//         let message = {
//             user: data.poster,
//             message: data.message,
//             id: id,
//             date: Date.now()
//         }
        
//         await db.collection('users').updateOne(
//             {'name': data.profile},
//             {$push: {'messages': message}}
//         )
//         res.status(200).send(JSON.stringify({id: id, success: true}))
        
//     }catch(err){
//         console.log(err)
//         res.status(500).send(JSON.stringify({success: false}))
//     }
// })

// app.get('/findUsers', async (req, res) => {
//     try{
//         let client = new MongoClient(uri)
//         let db = client.db('project')

//         let data = req.query.name
//         let re = RegExp(data)
//         let users = await db.collection('users').find({ "name": {$regex: re}})
//         .toArray((err, result) => {
//             if(err) throw err;
//             return result;
//         })
//         let userNames = []
//         for(const user of users){
//             userNames.push(user['name'])
//         }
//         console.log(userNames)
//         res.status(200).send(JSON.stringify({userNames: userNames}))

        
//     }catch(err){
//         console.log(err)
//         res.status(500).send(JSON.stringify({success: false}))
//     }
// })

// app.get('/getPending', async (req, res) => {
//     try{
//         let client = new MongoClient(uri)
//         let db = client.db('project')

//         let data = req.query.name
//         let doc = await db.collection('users').findOne({'name': data})
//         res.status(200).send(JSON.stringify({reqs: doc['pendingReq']}))
        
//     }catch(err){
//         console.log(err)
//         res.status(500).send(JSON.stringify({success: false}))
//     }
// })



// // start listening for request on port 3000
// const port = 3000;
// app.listen(port, () => {
//     console.log(`App is running, visit http://localhost:${port}`);
// })

// export default app