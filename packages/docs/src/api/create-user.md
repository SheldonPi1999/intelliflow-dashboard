# Create a user

## Visual
![Visual of create user](../assets/create-user.png)

## Required fields
-   username: Path `username`
-   password: Path `password`
-   email: Path `email`
-   name: Path `name`

## Standard fields
-   `verified` is set to false.
-   `admin` is only true on the first registered user.
-   `imageUrl` is set to a basic user icon if no image is given.

## Back (code)
### Request

-   Type: POST

```js
{
    url: "http://localhost:3030/users",
    Authorization: "Bearer <TOKEN-HERE>",
}
```

```JSON
{
	"username": "username",
	"password": "password",
	"email": "email",
	"name": "name",
	"phoneNumber": "phoneNumber",
	"address": "address",
	"birthDate": "birthDate",
	"languages": ["language_1", "language_2", "XXX"],
    "gender": "male",
    "imageUrl": "imagePath",
	//"verified": true,
	//"admin": true
}
```

### Response

-   Return type : JSON

```JSON
{
  "verified": false,
  "admin": false,
  "gender": "gender",
  "birthDate": "birthDate",
  "phoneNumber": "phoneNumber",
  "languages": ["language_1", "language_2", "XXX"],
  "address": "address",
  "imageUrl": "imagePath",
  "_id": "5fd62ebe9fafac40c8d8b995",
  "username": "username",
  "email": "email",
  "name": "name",
  "createdAt": "2020-12-13T15:09:50.090Z",
  "updatedAt": "2020-12-13T15:09:50.090Z",
  "__v": 0
}
```
