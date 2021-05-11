# Login a user

## Visual
![Visual of create user](../assets/login-user.png)

## Back (code)
### Request

-   Type: POST

```js
{
 "email": "email",
 "password": "password",
 "strategy": "local"
}
```

### Response

-   Type: POST

```js
{
    url: "http://localhost:3030/authentication",
    Authorization: "Bearer <TOKEN-HERE>",
}
```

```JSON
{
  "accessToken": "<TOKEN-HERE>",
  "authentication": {
    "strategy": "local",
    "accessToken": "<TOKEN-HERE>",
    "payload": {
      "iat": 1607086611,
      "exp": 1607173011,
      "aud": "https://yourdomain.com",
      "iss": "feathers",
      "sub": "5fc8ee87b590f20f2483e175",
      "jti": "7cf66492-2066-4aee-9e27-05fc38345366"
    }
  },
  "user": {
    "_id": "5fc8ee87b590f20f2483e175",
    "verified": false,
    "admin": false,
    "gender": "gender",
    "birthDate": "birthDate",
    "phoneNumber": "phoneNumber",
    "languages": ["language_1", "language_2", "XXX"],
    "address": "address",
    "username": "username",
    "email": "email",
    "name": "name",
    "createdAt": "2020-12-07T10:38:46.479Z",
    "updatedAt": "2020-12-07T10:38:46.479Z",
    "__v": 0
  }
}
```
