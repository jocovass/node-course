const http = require("http");
const fs = require("fs");
const url = require("url");
const replaceCard = require("./modules/replaceCard");
const createIngredients = require("./modules/createIngredients");
const replaceRecipie = require("./modules/replaceRecipie");

const indexTemp = fs.readFileSync(`${__dirname}/templates/index.html`, "utf-8");
const cardTemp = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");
const recipieTemp = fs.readFileSync(
  `${__dirname}/templates/recipie.html`,
  "utf-8"
);
const data = fs.readFileSync(`${__dirname}/data/data.json`, "utf-8");
const dataObj = JSON.parse(data);

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, "true");

  if (pathname === "/all" || pathname === "/") {
    res.writeHead(200, { "Content-type": "text/html" });
    const cardhtml = dataObj.map((el) => replaceCard(el, cardTemp)).join("");
    const output = indexTemp.replace("{%CARDS%}", cardhtml);

    res.end(output);
  } else if (pathname === "/recipie") {
    const ingHtml = createIngredients(dataObj[query.id].ingredients);
    const output = replaceRecipie(dataObj[query.id], recipieTemp, ingHtml);
    res.end(output);
  } else if (pathname.slice(pathname.length - 3) === "jpg") {
    fs.readFile(`${__dirname}/img/${pathname}`, (err, data) => {
      res.writeHead(200);
      res.end(data);
    });
  } else {
    res.writeHead(404, {
      "Content-type": "text/html",
    });
    res.end("<h1>ERROR 404: Page not found!</h1>");
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on port 8000...");
});
