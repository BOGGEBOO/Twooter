import assert from 'assert'
import request from 'supertest';
import app from './testBackEnd.js';

describe('signin', () =>{
    it('correct request', async () => {
        let result = await request(app).post('/signin').send({username: 'kalle', password: btoa('kalle')}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":true}')
    })
    it('correct kalle 2', async () => {
        let result = await request(app).post('/signin').send({username: 'kalle2', password: btoa('kalle2')}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":true}')
    })
    it('pre-existing user', async () => {
        let result = await request(app).post('/signin').send({username: 'kalle', password: btoa('kalle')}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":false}')
    })
})

describe('login', () => {
    it('correct request', async () => {
        let result = await request(app).post('/login').send({username: 'kalle', password: btoa('kalle')}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":true}')
        
    })
    it('no user', async () => {
        let result = await request(app).post('/login').send({username: 'qwerty', password: btoa('kalle')}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":false}')
    })
    it('wrong password', async () => {
        let result = await request(app).post('/login').send({username: 'kalle', password: btoa('kalle2')}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":false}')
        
    })
})

describe('send Friend req', async () => {
    it('correct request', async () => {
        let result = await request(app).post('/sendFriend').send({sender: 'kalle', receiver: 'kalle2'}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":true}')
    })
    it('pre-existing friend', async () => {
        let result = await request(app).post('/sendFriend').send({sender: 'kalle', receiver: 'kalle2'}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":false}')
    })
})

describe('acc Friend req', async () => {
    it('correct request', async () => {
        let result = await request(app).post('/accFriend').send({sender: 'kalle2', receiver: 'kalle'}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":true}')
        
    })
    it('pre-existing friend', async () => {
        let result = await request(app).post('/accFriend').send({sender: 'kalle2', receiver: 'kalle'}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":false}')
        
    })
    
})

describe('get Friends', async () => {
    it('correct request', async () => {
        let result = await request(app).get('/getFriends?name=kalle').set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        
    })
    
})

describe('get messages', async () => {
    it('correct request', async () => {
        let result = await request(app).get('/getmessages?name=kalle').set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        
    })
})

describe('add message', async () => {
    it('correct request', async () => {
        let result = await request(app).post('/addMessage').send({profile: 'kalle', poster: 'kalle', message: 'TEST'}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
    })
    it('correct request', async () => {
        let result = await request(app).post('/addMessage').send({profile: 'kalle', poster: 'kalle', message: ''}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        assert.equal(result.text, '{"success":false}')

    })
})

describe('find users', async () => {
    it('correct request', async () => {
        let result = await request(app).get('/findUsers?name=kalle').set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        
    })
})

describe('get pending', async () => {
    it('correct request', async () => {
        let result = await request(app).get('/getPending?name=kalle').set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200)
        
    })
})