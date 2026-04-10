import { Collection, Db, MongoClient } from "mongodb";

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
    throw new Error("MONGO_URI is not defined");
}

const DB_NAME = "cs-391-mp5";
export const LINKS_COLLECTION = "links-collection";

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
    // eslint-disable-next-line no-var
    var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
        client = new MongoClient(MONGO_URI);
        global._mongoClientPromise = client.connect();
    }
    clientPromise = global._mongoClientPromise;
} else {
    client = new MongoClient(MONGO_URI);
    clientPromise = client.connect();
}

async function getDb(): Promise<Db> {
    const connectedClient = await clientPromise;
    return connectedClient.db(DB_NAME);
}

export default async function getCollection(collectionName: string): Promise<Collection> {
    const db = await getDb();
    return db.collection(collectionName);
}