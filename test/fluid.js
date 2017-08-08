const request = require('../lib').request

describe('Fetch', function () {

    it('should something', function (done) {
        this.timeout(5000)

        request.get('http://google.com')
            .text().then(t => {
                done(null)
            })
            .catch(done)

    })


});