import express from "express";
import { createServer as createViteServer } from "vite";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import os from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  // PENTING: Di AI Studio harus port 3000. 
  // Jika di lokal ingin port lain, bisa set variabel lingkungan PORT=3001
  const PORT = parseInt(process.env.PORT || "3000", 10);

  app.use(cors());
  app.use(express.json());

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const server = app.listen(PORT, "0.0.0.0", async () => {
    const networkInterfaces = os.networkInterfaces();
    let localIp = 'localhost';
    
    for (const name of Object.keys(networkInterfaces)) {
      for (const net of networkInterfaces[name]!) {
        if (net.family === 'IPv4' && !net.internal) {
          localIp = net.address;
        }
      }
    }

    console.log(`\n🚀 Server is ready!`);
    console.log(`🏠 Local:   http://localhost:${PORT}`);
    console.log(`🌐 Network: http://${localIp}:${PORT}`);
    
    try {
      const response = await axios.get('https://api.ipify.org?format=json');
      console.log(`🌍 Public:  http://${response.data.ip}:${PORT}`);
    } catch (e) {
      // Quiet fail if no internet for public IP check
    }
    
    console.log(`\nTIP: Jika muncul error EADDRINUSE, berarti port ${PORT} sedang digunakan aplikasi lain.`);
  });

  server.on('error', (e: any) => {
    if (e.code === 'EADDRINUSE') {
      console.error(`\n❌ ERROR: Port ${PORT} sudah dipakai!`);
      console.error(`Solusi: Matikan aplikasi yang menggunakan port ${PORT} atau gunakan port lain di server.ts`);
      process.exit(1);
    }
  });
}

startServer();
