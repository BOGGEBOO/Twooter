import assert from 'assert';

//TODO lägga till before funktion som startar upp mongodb och app.js

describe('get', () => {
    it('corect request', async () => {
        let result = await fetch("http://localhost:3000/get?id=FR0JO");
        let body = await result.json()
        assert.equal(result.status, 200);
        assert.equal(body.message, "woooow");
    })
    it('message not found', async () => {
        let result = await fetch("http://localhost:3000/get?id=000000");
        assert.equal(result.status, 400);
    })
})

describe('getall', () => {
    it('correct request', async () => {
        let result = await fetch("http://localhost:3000/getall");
        let body = await result.json()
        assert.equal(result.status, 200);
        assert.equal(body[0].message, "din mmana")
    })
})