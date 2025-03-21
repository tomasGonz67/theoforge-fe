module.exports = {
    get: jest.fn((url) => {
        if (url) {
            return Promise.resolve({
                data: 'data'
            });
        }
    }),
    post: jest.fn((url) => {
        if (url === '/guests') {
            return Promise.resolve({
                data: 'data'
            });
        }
        if (url === '/auth/login') {
            return Promise.resolve({
                data: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzQxMzI5NDA0fQ.ZhzyaDb0kMajVxsf8zGSO8tgvh2lKAMRSOTcG4GbqbM'}
            });
        }
        if (url === '/auth/register') {
            return Promise.resolve({
                data: 'data3'
            });
        }
    }),
    create: jest.fn(function () {
        return this;
    })
};