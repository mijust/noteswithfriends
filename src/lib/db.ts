import { MongoClient, ObjectId } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

let cachedClient: MongoClient | null = null;
let cachedDb: any = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = await MongoClient.connect(MONGODB_URI as string);
  const db = client.db(MONGODB_DB);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}

export async function getModules() {
  const { db } = await connectToDatabase();
  
  const modules = await db.collection('modules')
    .find({})
    .sort({ updatedAt: -1 })
    .toArray();
  
  return JSON.parse(JSON.stringify(modules));
}

export async function getModuleById(id: string) {
  const { db } = await connectToDatabase();
  
  try {
    const module = await db.collection('modules').findOne({
      _id: new ObjectId(id)
    });
    
    if (!module) return null;
    
    return JSON.parse(JSON.stringify(module));
  } catch (error) {
    console.error('Error fetching module:', error);
    return null;
  }
}

export async function createModule(moduleData: any) {
  const { db } = await connectToDatabase();
  
  const result = await db.collection('modules').insertOne({
    ...moduleData,
    notes: [],
    createdAt: new Date(),
    updatedAt: new Date()
  });
  
  return result.insertedId;
}

export async function addNoteToModule(moduleId: string, noteData: any) {
  const { db } = await connectToDatabase();
  
  const noteId = new ObjectId();
  
  await db.collection('modules').updateOne(
    { _id: new ObjectId(moduleId) },
    { 
      $push: { notes: { _id: noteId, ...noteData } },
      $set: { updatedAt: new Date() }
    }
  );
  
  return noteId;
}