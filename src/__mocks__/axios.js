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
        } else if (url.includes('/auth/auth')){
            return Promise.resolve({
                data: {username: {
                    "nickname":"test",
                    "role":"ADMIN",
                    "address":"Address",
                    "subscription_plan":"PREMIUM",
                    "id":"c405b07d-e6c9-4fa4-963f-93bbb7a26f9d",
                    "email_verified":true,
                    "city":"City",
                    "verification_token":null,
                    "state":"State",
                    "email":"test@test.com",
                    "created_at":"2025-03-30T10:39:05.945476+00:00",
                    "zip_code":"Zip","hashed_password":"$2b$12$CIMiLrX6MazfjJcfOeapK.RBA9KKbov/1N8yp3iv.KiX6MUEP/U8K",
                    "updated_at":"2025-04-01T00:19:14.435473+00:00",
                    "card_number":"Card",
                    "first_name":"First",
                    "failed_login_attempts":0,
                    "ccv":"CCV",
                    "last_name":"Last",
                    "is_locked":false,
                    "security_code":"Sec",
                    "phone_number":"Phone"
                  }}
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