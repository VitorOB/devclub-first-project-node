/**
 *  - Query Params => meusite.com/users?nome=vitor&age=27 //FILTROS
 *  - Route Params => /users/2          //BUSCAR, DELETAR OU ATUALIZAR ALGO ESPECIFICO
 *  - Request Body => { "name:" "Vitor", "age":}
 *
 *  - GET          => Buscar informações no backend
 *  - POST         => Criar informação no backend
 *  - PUT/PATCH    => Alterar/Atualizar informação no backend
 *  - DELETE       => Delete informação no backend
 *
 *  - Middlewares  => INTERCEPTADOR => Tem o poder de parar ou alterar dados da requisição
 */
const express = require("express");
const uuid = require("uuid");

const port = 3000;
const app = express();
app.use(express.json());

/* Usando route params
app.get('/users/:id', (req, res) => {
    //const {name, age} = req.query; //Destructuring assignment
    //const age = req.query.age;
   // const {id} = req.params;

    console.log(id)
    return res.json({id});
})
*/
/* Usando query params
app.get('/users', (req, res) => {
    const {name, age} = req.query; //Destructuring assignment
    //const age = req.query.age;
   // const {id} = req.params;

    //console.log(id)
    return res.json({name, age});
})
*/
const users = [];

// const myFirstMiddleware = (req, res, next) => {
//     console.log('to aqui');

//     next()
// }

const checkIdUser = (req, res, next) => {
  const { id } = req.params;
  const index = users.findIndex((user) => user.id === id);

  if (index < 0) {
    return res.status(404).json({ error: "User not found" });
  }

  req.userIndex = index;
  req.userId = id;
  next();
};

app.get("/users/", (req, res) => {
  return res.json({ users });
});
app.post("/users/", (req, res) => {
  const { name, age } = req.body;

  const user = { id: uuid.v4(), name, age };

  users.push(user);

  return res.status(201).json(user);
});

app.put("/users/:id", checkIdUser, (req, res) => {
  const { name, age } = req.body;
  const index = req.userIndex;
  const id = req.userId;
  const upUser = { id, name, age };

  users[index] = upUser;
  return res.json(upUser);
});

app.delete("/users/:id", checkIdUser, (req, res) => {
  const index = req.userIndex;

  users.splice(index, 1);

  return res.status(204).json({ users });
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
