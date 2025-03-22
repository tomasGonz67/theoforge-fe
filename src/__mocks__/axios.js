module.exports = {
    interceptors: {
        response: {
            use: jest.fn()
        },
        request: {
            use: jest.fn()
        }
    },
    get: jest.fn((url) => {
        if (url.includes('/guests')) {
            return Promise.resolve({
                data: [{
                    "session_id": "test",
                    "page_views": [
                      "/home",
                      "/about"
                    ],
                    "interaction_events": [
                      "clicked_signup"
                    ],
                    "name": "John Doe",
                    "interaction_history": [
                      {
                        "event": "visited_homepage",
                        "timestamp": "2025-03-01T12:00:00Z"
                      }
                    ],
                    "status": "NEW",
                    "id": "2b554a9d-1285-4852-8564-c03a187b44a5",
                    "first_visit_timestamp": "2025-03-14T00:25:56.321191Z",
                    "created_at": "2025-03-14T00:25:56.321191Z",
                    "updated_at": "2025-03-17T03:08:14.656178Z"
                  }]
            });
        } else {
            return Promise.resolve({
                data: 'data'
            });
        }
    }),
    post: jest.fn((url) => {
        if (url.includes('/guests')) {
            return Promise.resolve({
                data: 'data'
            });
        }
        if (url.includes('/auth/login')) {
            return Promise.resolve({
                data: { access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0QHRlc3QuY29tIiwicm9sZSI6IkFETUlOIiwiZXhwIjoxNzQxMzI5NDA0fQ.ZhzyaDb0kMajVxsf8zGSO8tgvh2lKAMRSOTcG4GbqbM'}
            });
        }
        if (url.includes('/auth/register')) {
            return Promise.resolve({
                data: 'data3'
            });
        }
    }),
    create: jest.fn(function () {
        return this;
    })
};