module.exports = {
    get: jest.fn((url) => {
        if (url) {
            return Promise.resolve({
                data: 'data'
            });
        }
    }),
    post: jest.fn((url) => {
        if (url === 'http://localhost:8000/guests') {
            return Promise.resolve({
                data: 'data'
            });
        }
        if (url === 'http://localhost:8000/auth/login') {
            return Promise.resolve({
                data: 'data2'
            });
        }
        if (url === 'http://localhost:8000/auth/register') {
            return Promise.resolve({
                data: 'data3'
            });
        }
    }),
    create: jest.fn(function () {
        return this;
    })
};