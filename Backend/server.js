import { app } from "./src/app.js";
import { connectDB } from "./src/config/database.js";
// import { testAi } from "./src/services/ai.services.js";
import http from "http"
import { initSocket } from "./src/socket/socket.Server.js";


const PORT = process.env.PORT ;

const httpServer=http.createServer(app)

initSocket(httpServer)

// testAi();

const startServer = async () => {
  await connectDB();

  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
};

startServer();
