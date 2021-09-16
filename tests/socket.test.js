
const createServer = require('./server');
const Client = require("socket.io-client");

describe("my awesome project", () => {
  let io, serverSocket, clientSocket;

  beforeAll((done) => {
    const app = createServer();
    const httpServer = require("http").createServer(app);
    const options = { /* ... */ };
    io = require("socket.io")(httpServer, options);

    httpServer.listen(() => {
      const port = httpServer.address().port;
      clientSocket = new Client(`http://localhost:${port}`);

      io.on("connection", (socket) => {
        socket.join("room-1");
        serverSocket = socket;

      });

      clientSocket.on("connect", () => {
        done();
      });
    });
  });

  afterAll(() => {
    io.close();
    clientSocket.close();
  });

  test("should work", (done) => {
    clientSocket.on("hello", (arg) => {
      expect(arg).toBe("world");
      done();
    });
    serverSocket.emit("hello", "world");
  });

  test("should work (with ack)", (done) => {
    serverSocket.on("hi", (cb) => {
      cb("hola");
    });
    clientSocket.emit("hi", (arg) => {
      expect(arg).toBe("hola");
      done();
    });
  });
  
  test("joining room", (done) => {
  
    clientSocket.on('connectToRoom',(arg)=>{
      expect(arg).toBe("You are in room-1");
      done();
    });

    io.to("room-1").emit('connectToRoom',"You are in room-1");
  });
});