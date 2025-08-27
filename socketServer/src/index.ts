import { createServer, IncomingMessage, ServerResponse } from "http";

const PORT = 3000;

const server = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Content-Type", "application/json");

  if (req.url === "/" && req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify({ message: "Hello from TypeScript HTTP server!" }));
  } else if (req.url === "/about" && req.method === "GET") {
    res.writeHead(200);
    res.end(JSON.stringify({ message: "This is the About page." }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: "Not Found" }));
  }
});

server.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});


/**
 * what is the work of this server is :-
 * it first connect with the frontend who wnat to upload teeir video 
 * then it listen a SNS or similar type of queqs of notificatons system
 * when a notification come then it imideatly notify the user
 */