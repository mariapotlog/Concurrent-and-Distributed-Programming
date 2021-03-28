const http = require("http");
const { v4: uuidv4 } = require("uuid");

let fruitData = require("./data.json");

const getReqBody = (req) => {
  return new Promise((resolve, reject) => {
    try {
      let body = "";
      req.on("data", (chunk) => (body += chunk.toString()));
      req.on("end", () => resolve(body));
    } catch (error) {
      reject(err);
    }
  });
};

const findFruitList = () =>
  new Promise((resolve, _reject) => resolve(fruitData));

const getFruitList = async (_req, res) => {
  try {
    const fruitList = await findFruitList();
    res.writeHead(200, { "Content-Type": "application/json" });
  } catch (error) {
    console.log(error.message);
  }
};

const findFruitById = (id) => {
  return new Promise((resolve, _reject) => {
    const fruit = fruitData.find((f) => f.id === id);
    resolve(fruit);
  });
};

const getFruit = async (_req, res, id) => {
  try {
    const fruit = await findFruitById(id);
    if (!fruit) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Fruit not found" }));
    }
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(fruit));
  } catch (error) {
    console.log(error);
  }
};

const addFruit = ({ name, price }) => {
  return new Promise((resolve, _reject) => {
    const newFruit = { id: uuidv4(), name, price };
    fruitData.push(newFruit);
    resolve(newFruit);
  });
};

const postFruit = async (req, res) => {
  try {
    const body = await getReqBody(req);
    const parsedBody = JSON.parse(body);
    const newFruit = await addFruit(parsedBody);
    res.writeHead(201, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(newFruit));
  } catch (error) {
    console.log(error);
  }
};

const updateFruit = async (id, fruit) => {
  return new Promise((resolve, _reject) => {
    const index = fruitData.findIndex((f) => f.id === id);
    fruitData[index] = { id, ...fruit };
    resolve(fruitData[index]);
  });
};

const putFruit = async (req, res, id) => {
  try {
    const fruit = await findFruitById(id);

    if (!fruit) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Fruit Not Found" }));
    }
    const body = await getReqBody(req);
    const parsedBody = JSON.parse(body);
    const fruitToUpdate = {
      name: parsedBody.name ?? fruit.name,
      price: parsedBody.price ?? fruit.price,
    };

    const updatedFruit = await updateFruit(id, fruitToUpdate);

    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(JSON.stringify(updatedFruit));
  } catch (error) {
    console.log(error.message);
  }
};

const removeFruit = (id) => {
  return new Promise((resolve, _reject) => {
    fruitData = fruitData.filter((f) => f.id !== id);
    resolve(fruitData);
  });
};

const deleteFruit = async (_req, res, id) => {
  try {
    const fruit = await findFruitById(id);

    if (!fruit) {
      res.writeHead(404, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ message: "Fruit Not Found" }));
    }

    const newFruitData = await removeFruit(id);
    res.writeHead(200, { "Content-Type": "application/json" });
    return res.end(
      JSON.stringify({
        message: `Fruit with id ${id} removed`,
        fruitList: newFruitData,
      })
    );
  } catch (error) {
    console.log(error);
  }
};

const api = "/api";

const server = http.createServer((req, res) => {
  if (req.url === `${api}/fruits` && req.method === "GET") {
    getFruitList(req, res);
  } else if (req.url.match(/\/api\/fruit\/\w+/) && req.method === "GET") {
    const id = req.url.split("/")[3];
    getFruit(req, res, id);
  } else if (req.url === `${api}/fruits` && req.method === "POST") {
    postFruit(req, res);
  } else if (req.url.match(/\/api\/fruit\/\w+/) && req.method === "PUT") {
    const id = req.url.split("/")[3];
    putFruit(req, res, id);
  } else if (req.url.match(/\/api\/fruit\/\w+/) && req.method === "DELETE") {
    const id = req.url.split("/")[3];
    deleteFruit(req, res, id);
  } else {
    res.writeHead(404, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ message: "Route not found" }));
  }
});

const PORT = 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = server;
