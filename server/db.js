import { MongoClient } from "mongodb";

let cachedClient;
let cachedDb;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI environment variable topilmadi.");
  }

  cachedClient = new MongoClient(mongoUri);
  await cachedClient.connect();

  const dbName = process.env.MONGODB_DB_NAME || "verifyuz";
  cachedDb = cachedClient.db(dbName);

  return { client: cachedClient, db: cachedDb };
}
