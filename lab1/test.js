import assert from 'assert';

describe('get', () => {
    it('should work', async () => {
        let result = await fetch("http://localhost:3000/get?id=FR0JO");
        assert.equal(result.status, 200);
        assert.equal(result.statusText, "OK");
        assert.equal(result.message, "woooow");
    })
})