import assert from 'assert';
import request from 'supertest';
import app from './app.js';

describe('get', () => {
    it('corect request', async () => {
        let result = await request(app).get('/get?id=FR0JO').set('Accept', 'application/json').expect('Content-Type', /json/)
        assert.equal(result.status, 200);
        assert.equal(result.body.message, "woooow");
    })
    it('message not found', async () => {
        let result = await request(app).get('/get?id=000000').set('Accept', 'application/json').expect(400);
        assert.equal(result.status, 400);
    })
    it('wrong method', async () => {
        let result = await request(app).post('/get?id=FR0JO').set('Accept', 'application/json').expect(405);
        assert.equal(result.status, 405);
    })
})

describe('getall', () => {
    it('correct request', async () => {
        let result = await request(app).get('/getall').set('Accept', 'application/json').expect('Content-Type', /json/).expect(200)
        assert.equal(result.status, 200);
        assert.equal(result.body[0].message, "din mmana") //asserts the first message stored in the db
    })
    it('wrong method', async () => {
        let result = await request(app).post('/getall')
        assert.equal(result.status, 405);
    })
})

describe('save', () => {
    it('correct request', async () => {
        let result = await request(app).post('/save').send({message: "It works man"}).set('Accept', 'application/json').expect(200)
        assert.equal(result.status, 200);
    })
    it('banned content', async () => {
        let result = await request(app).post('/save').send({message: "helvete it no works man"}).set('Accept', 'application/json').expect("Dåligt meddelande")
        assert.equal(result.status, 200);
    })
    it('wrong method', async () => {
        let result = request(app).get('/save').expect(405)
    })
    
})

describe('flag', () => {
    it('correct request', async () => {
        let result = await request(app).post('/flag').send({id: "adpfC", read: true}).set('Accept', 'application/json').expect(200)

        assert.equal(result.status, 200);
    })
    it('wrong id', async () => {
        let result = await request(app).post('/flag').send({id: "0000", read: true}).set('Accept', 'application/json').expect(400)

        assert.equal(result.status, 400);
    })
    it('wrong method', async () => {
        let result = await request(app).get('/flag').expect(405)
        assert.equal(result.status, 405)
    })
})