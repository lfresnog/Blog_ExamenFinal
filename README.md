# Examen Final

Blog

![GitHub](https://img.shields.io/github/license/lfresnog/Blog_ExamenFinal)
![GitHub Release Date](https://img.shields.io/github/release-date/lfresnog/Blog_ExamenFinal)
![GitHub last commit](https://img.shields.io/github/last-commit/lfresnog/Blog_ExamenFinal)

## Install/Run

All the necessary packages are in the `package.json` file.

To install them, run this command:

```js
npm install
```

To run the programme in the server 4004

```js
npm start
```

## Schema.graphql
En este ejercicio, he decidido utizar el mail como variable única identificativa del usuario en vez de _id

```js
type Mutation {
    signUp(mail:String!,pwd:String!,author:Boolean!):User!
    logIn(mail:String!,pwd:String!):User!
    logOut(mail:String!,token:String!):User!
    removeUser(mail:String!,pwd:String!,token:String!):User!
    readAll(mail:String!,token:String!):[Publication]!
    readAuthor(mail:String!,token:String!,author:String!):[Publication]!
    readPublication(mail:String!,token:String!,title:String!):[Publication]!
    addPublication(mail:String!,token:String!,title:String!,description:String!):Publication!
    removePublication(mail:String!,token:String!,title:String!):Publication!
}
type Subscription {
    tellMe(mail:String!,token:String!,author:String!):String!
}
type User {
    _id: ID!
    mail: String!
    pwd: String!
    author: Boolean!
    token: String
}
type Publication {
    _id: ID!
    title: String!
    description: String!
    author: User!
}
```

## Query

- ok Test

```js
query{
  ok
}
```

## Mutations

- Sign Up

```js
mutation{
  signUp(mail:"test",pwd:"test",author:true){
    _id
    mail
    pwd
    token
  }
}

mutation{
  signUp(mail:"test1",pwd:"test",author:false){
    _id
    mail
    pwd
    token
  }
}
```

- Log In

```js
mutation{
  logIn(mail:"test",pwd:"test"){
    _id
    mail
    pwd
    token
  }
}

mutation{
  logIn(mail:"test1",pwd:"test"){
    _id
    mail
    pwd
    token
  }
}
```

- Log Out

```js
mutation{
  logOut(mail:"test",token:"61fa2ea0-390f-11ea-992c-ed750a6b986d"){
    _id
    mail
    pwd
    token
  }
}
```

- Remove user

```js
mutation{
  removeUser(mail:"test",pwd:"test",token:"7ad789e0-390f-11ea-992c-ed750a6b986d"){
    _id
    mail
    pwd
    token
  }
}
```

- Read All

```js
mutation{
  readAll(mail:"test",token:"33eac680-3907-11ea-a902-cf74bb8af46c"){
    title
  }
}
```

- Read author publications

```js
mutation{
  readAuthor(mail:"test1",token:"33eac680-3907-11ea-a902-cf74bb8af46c",author:"test"){
    title
    author{
      mail
    }
  }
}
```

- Read one publication

```js
mutation{
  readPublication(mail:"test",token:"33eac680-3907-11ea-a902-cf74bb8af46c",title:"test"){
    title
    author{
      mail
    }
  }
}
```

- Add Publication

```js
mutation{
  addPublication(mail:"test",token:"c5542bc0-390c-11ea-8a4d-39ae3b1129ce",title:"test",description:"test"){
    _id
    title
    description
    author{
    _id
    mail
    pwd
    token
    }
  }
}
```

- Tell Me

```js
subscription{
  tellMe(mail:"test1",token:"1b533490-390c-11ea-b291-65741e9beba6",author:"test")
}
```

## ⚖️ License

This project is licensed under the MIT License - see the [LICENSE.md](https://github.com/lfresnog/Blog_ExamenFinal/LICENSE) file for details