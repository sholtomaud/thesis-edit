"use esversion 6";
"use strict";


const net = require("net");
const repl = require("repl");
const { removeSync } = require("fs-extra");
let connections = 0;

removeSync("/tmp/node-repl-sock");

const { METHODS } = require("http");
// const { writeFile, existsSync, mkdirSync } = require("fs");
const { writeFile, existsSync, ensureDirSync } = require("fs-extra");
const { join, resolve } = require("path");

const api = new Proxy({},
    {
        get(target, propKey) {
            // console.log("propKey",propKey);

            const method = METHODS.find(method =>
            {
                
                return propKey.startsWith(method.toLowerCase());
            }
            );

            // console.log("MEHTOD",method);

            if (!method) return;

            const path = "/" +
                propKey
                    .substring(method.length)
                    .replace(/([a-z])([A-Z])/g, "$1/$2")
                    .replace(/\$/g, "/$/")
                    .toLowerCase();

            return (...args) => {
                const finalPath = path.replace(/\$/g, () => args.shift());

                const queryOrBody = args.shift() || {};
                
                const dir = join(process.cwd(),"data",finalPath);

                console.log(`DIR ${dir}`);

                if (!existsSync(dir)){
                    ensureDirSync(dir);
                }

                const done = ()=> console.log(method, `${finalPath}.json`, JSON.stringify(queryOrBody));
                
                writeFile(`${dir}.json`,JSON.stringify(queryOrBody),done);
                


                // // You could use fetch here
                // return fetch(finalPath, { method, body: queryOrBody } );

                
            };
        }
    }
);

// So the index will be a graph with SPO lookup.
// This could also be the api to the data?
// But it seems that we already have the means of looking this up with the below.
// In what way isn't this a graph? It doesn' ahave SPO. Node/edge.




const colors = { RED: "31", GREEN: "32", YELLOW: "33", BLUE: "34", MAGENTA: "35" };
const colorize = (color, s) => `\x1b[${color}m${s}\x1b[0m`;

// Some useful stuff



const pjson = require("../package.json");
const user = colorize(colors.BLUE, process.env.USER);
const cwd = colorize(colors.YELLOW, process.cwd());
// const prod = "EMERGY";

const ver = colorize(colors.BLUE, `(v.${pjson.version})`);
const product = colorize(colors.GREEN, pjson.name);
const carrot = colorize(colors.GREEN, ">");
const prompt = `${product} ${ver}${carrot}`;

const myRepl = repl.start(prompt);

const state = {
    printSomething(){
        console.log("hello");
    },
    help(){
        // const product = colorize(colors.GREEN, prod);
        console.log(`
            Hello, ${user}!

            You're running the Node.js REPL in ${cwd}.
        `);
    },
    api
};

Object.assign(myRepl.context,state);


// Print the welcome message
// sayWelcome();
// https://medium.com/trabe/mastering-the-node-js-repl-part-2-365c52a5203d

// const sayBye = `
//   Goodbye, ${user}!
// `;

// var server = net.createServer((socket) => {
//     connections += 1;
//     socket.write(`
// Hello, ${user}

// Welcome to the ${product} API.

// Type Help for instructions

// `);

// var ver = require("child_process").execSync("git rev-parse HEAD");






// repl.start({
//     prompt: "Node.js via stdin> ",
//     input: api,
//     output: process.stdout
// });

// net.createServer((socket) => {
//     connections += 1;
//     repl.start({
//         prompt: "Emergy-API> ",
//         input: socket,
//         output: socket
//     }).on("exit", () => {
//         socket.end();
//     });
// }).listen("/tmp/node-repl-sock");

// net.createServer((socket) => {
//     connections += 1;
//     repl.start({
//         prompt: "Node.js via TCP socket> ",
//         input: socket,
//         output: socket
//     }).on("exit", () => {
//         socket.end();
//     });
// }).listen(5001);

// var client = new net.Socket(); 
// client.setEncoding("utf8");
// // connect to server
// client.connect("/tmp/node-repl-sock", function () {
//     console.log("connected to server");
//     client.write("Who needs a browser to communicate?");
// });
// // when receive data, send to server
// process.stdin.on("data", function (data) {
//     client.write(data);
// });
// // when receive data back, print to console
// client.on("data",function(data) {
//     console.log(data);
// });
// // when server closed
// client.on("close",function() {
//     console.log("connection is closed");
// });

// Color functions
// const colors = { RED: "31", GREEN: "32", YELLOW: "33", BLUE: "34", MAGENTA: "35" };
// const colorize = (color, s) => `\x1b[${color}m${s}\x1b[0m`;

// const prod = "EMERGY";
// // Some useful stuff
// const user = colorize(colors.BLUE, process.env.USER);
// const cwd = colorize(colors.YELLOW, process.cwd());
// const product = colorize(colors.GREEN, prod);
// const say = message => () => console.log(message);
// const sayWelcome = say(`
//   Hello, ${user}!
//   You're running the Node.js REPL in ${cwd}.
// `);

// Print the welcome message
// sayWelcome();
// https://medium.com/trabe/mastering-the-node-js-repl-part-2-365c52a5203d

// const sayBye = `
//   Goodbye, ${user}!
// `;

// var server = net.createServer((socket) => {
//     connections += 1;
//     socket.write(`
// Hello, ${user}

// Welcome to the ${product} API.

// Type Help for instructions

// `);

//     // var ver = require("child_process").execSync("git rev-parse HEAD");
//     var pjson = require("../package.json");
//     var ver = pjson.version;

//     const prompt = `api v.${ver} >>`;


//     // const replServer = repl.start({ prompt: "> " });
//     // replServer.defineCommand("sayhello", {
//     //     help: "Say hello",
//     //     action(name) {
//     //         this.clearBufferedCommand();
//     //         console.log(`Hello, ${name}!`);
//     //         this.displayPrompt();
//     //     }
//     // });
//     // replServer.defineCommand("saybye", function saybye() {
//     //     console.log("Goodbye!");
//     //     this.close();
//     // });
//     repl.start({
//         prompt: prompt,
//         input: socket,
//         output: socket,
//         eval: api
//     }).on("exit", () => {
//         socket.write(sayBye);
//         // socket.end();
//     });
    
// }).listen("/tmp/node-repl-sock");

// // var client = new net.Socket();
// // client.connect(1337, "127.0.0.1", function() {
// //     console.log("Connected");
// //     client.write("Hello, server! Love, Client.");
// // });

// server.on("data", function(data) {
//     console.log("Received: " + data);
//     server.destroy(); // kill client after server's response
// });

// client.on("close", function() {
//     console.log("Connection closed");
// });


// GET /
// api.get();
// // GET /users
// api.getUsers();
// // GET /users/1234/likes

// const getUser = id => users[id];
// const getUsers = () => Object.values(users);


// const getUsers = (req, res) => {
//     return res.send(userService.getUsers());
//   };

// SeaLion.prototype.createHandler = function(){
  
// return function(request, response){
//     var pathname = url.parse(request.url).pathname,
  
// var http = require("http"),
//     websocket = require("websocket-stream"),
//     url = require("url");
    
// var server = http.createServer(
//     function(request, response){
//         var pathname = url.parse(request.url).pathname;
//         console.log(pathname);
//     }        
// );
// // var server = http.createServer(router.createHandler());

// websocket.createServer({server: server}, function(stream) {
//     console.log("serving socket handler");
    
//     var roomStream = rooms.lobby.connect();
    
//     stream.pipe(roomStream).pipe(stream);
    
//     stream.on("error", function(error){
//         console.log(error);
//     });
// });
    
// server.listen(8080);

// api.getUsers$Likes("1234");
// // // GET /users/1234/likes?page=2
// api.getUsers$Likes("1234/likes?page=2", { page: 2 });
// POST /items with body
// api.postItems({ name: "Item name" });
// // api.foobar is not a function
// try {
//     // api.foobar();    
//     api.putDocuments$Document("user_ID/:id",{ _ID: "Item name" });
// } catch (error) {
//     console.error(error);
// }



const camelcase = require("camelcase");

const prefix = "findWhere";

const assertions = {
    Equals: (object, value) => object === value,
    IsNull: (object, value) => object === null,
    IsUndefined: (object, value) => object === undefined,
    IsEmpty: (object, value) => object.length === 0,
    Includes: (object, value) => object.includes(value),
    IsLowerThan: (object, value) => object === value,
    IsGreaterThan: (object, value) => object === value
};

const assertionNames = Object.keys(assertions);

const wrap = arr => {
    return new Proxy(arr, {
        get(target, propKey) {
            if (propKey in target) return target[propKey];
            const assertionName = assertionNames.find(assertion =>
                propKey.endsWith(assertion)
            );
            if (propKey.startsWith(prefix)) {
                const field = camelcase(
                    propKey.substring(
                        prefix.length,
                        propKey.length - assertionName.length
                    )
                );
                const assertion = assertions[assertionName];
                return value => {
                    return target.find(item => assertion(item[field], value));
                };
            }
        }
    });
};

const arr1 = wrap([
    { name: "John", age: 23, skills: ["mongodb"] },
    { name: "Lily", age: 21, skills: ["redis"] },
    { name: "Iris", age: 43, skills: ["python", "javascript"] }
]);


// NORMAL DB?
// const id = await db.insertUserReturningId(userInfo)
// Runs an INSERT INTO user ... RETURNING id

// GRAPH DB?
// const arr2 = wrap([
//     { name: "John", age: 23, skills: ["mongodb"] },
//     { name: "Lily", age: 21, skills: ["redis"] },
//     { name: "Iris", age: 43, skills: ["python", "javascript"] }
// ]);

// var triple = JSON.stringify({
//     subject: 'A', predicate: 'C', object: 'B'
//   })

// [
//     { key: 'spo::A::C::B', value: triple, type: 'put' },
//     { key: 'sop::A::B::C', value: triple, type: 'put' },
//     { key: 'ops::B::C::A', value: triple, type: 'put' },
//     { key: 'osp::B::A::C', value: triple, type: 'put' },
//     { key: 'pso::C::A::B', value: triple, type: 'put' },
//     { key: 'pos::C::B::A', value: triple, type: 'put' }
//   ]



// console.log(arr1.findWhereNameEquals("Lily")); // finds Lily
// console.log(arr1.findWhereSkillsIncludes("javascript"));
