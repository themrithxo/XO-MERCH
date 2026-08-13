const mongoose = require('mongoose');
const dns = require('dns');

// Set public DNS servers (8.8.8.8) to resolve SRV records on Windows if local ISP DNS fails
try {
  dns.setServers(['8.8.8.8', '8.8.4.4', '1.1.1.1']);
} catch (dnsErr) {
  console.warn('DNS server override notice:', dnsErr.message);
}

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[XO Backend] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.warn(`[XO Backend] Atlas MongoDB connection failed (${error.message}). Attempting MongoMemoryServer fallback...`);
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[XO Backend] MongoMemoryServer connected successfully: ${conn.connection.host}`);
      return true;
    } catch (memErr) {
      console.warn(`[XO Backend] MongoMemoryServer download/start skipped (${memErr.message}). Standalone Mock DB Active.`);
      return false;
    }
  }
};

module.exports = connectDB;
