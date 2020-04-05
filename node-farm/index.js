const fs = require('fs'); //node module for access file system
const http = require('http'); //creating a server
const url = require('url'); //parsing urls on the reqest obj, for routing
const slugify = require('slugify'); //a function to create URL slugs

const replaceTemplate = require('./modules/replaceTemplate');

////////////////////////////////////////////////
//////////FILES
//Blocking, syncrhronous way
//read text from files
const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
//writing and creating new files
const textOut = `This is what we know about the avocado: ${textIn}. \nCreated on ${Date.now()}`;
fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written!');

//Non-Blocking, asynchronous way
fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
  // if (err) return console.log('ERROR!');
  fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
    fs.readFile(`./txt/append.txt`, 'utf-8', (err, data3) => {
      // console.log(data3);
      fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
        // console.log('Your file has been written');
      });
    });
  });
});
// console.log('Loading...');

////////////////////////////////////////////////
//////////SERVER

//. the dot means where the script is runing, and the special node variable __dirname means where the file is located
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const slugs = dataObj.map(el => slugify(el.productName, { lower: true }));
console.log(slugs);

//creating a server and saving it into a variable
const server = http.createServer((req, resp) => {
  //we pass true as second argument, to parse the quewry string into a separate obj
  const { query, pathname } = url.parse(req.url, true);

  //OVERVIEW
  if (pathname === '/' || pathname === '/overview') {
    resp.writeHead(200, { 'Content-type': 'text/html' });
    const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    resp.end(output);

    //PRODUCT
  } else if (pathname === '/product') {
    resp.writeHead(200, { 'Content-type': 'text/html' });
    const product = dataObj[query.id];
    const output = replaceTemplate(tempProduct, product);
    resp.end(output);

    //API
  } else if (pathname === '/api') {
    resp.writeHead(200, { 'Content-type': 'application/json' });
    resp.end(data);

    //NOT FOUND
  } else {
    //we can send diffrent headers
    resp.writeHead(404, {
      'Content-type': 'text/html',
      'my-own-header': 'hello-world'
    });
    resp.end('<h1>Page not found!</h1>');
  }
});

//listening for localhost port 8000 on our server
server.listen(8000, '127.0.0.1', () => {
  console.log('Listening to requests on port 8000');
});
