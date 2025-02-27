// File location: /src/lib/db.ts
import { MongoClient, ObjectId, Db } from 'mongodb';

// Better typing for MongoDB connection
interface MongoConnection {
  client: MongoClient;
  db: Db;
}

// Module types with better structure
export interface Note {
  _id: ObjectId;
  type: 'markdown' | 'freeform';
  fileName: string;
  content?: string;
  fileUrl?: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Module {
  _id: ObjectId;
  title: string;
  description: string;
  ownerId: string;
  collaborators?: string[];
  notes: Note[];
  createdAt: Date;
  updatedAt: Date;
  isPublic?: boolean;
  tags?: string[];
}

// Connection caching
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Environment variables validation
const MONGODB_URI = process.env.MONGODB_URI;
const MONGODB_DB = process.env.MONGODB_DB;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable');
}

if (!MONGODB_DB) {
  throw new Error('Please define the MONGODB_DB environment variable');
}

/**
 * Connect to MongoDB with caching for better performance
 */
export async function connectToDatabase(): Promise<MongoConnection> {
  // If we already have a connection, use it
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    // Connect to the MongoDB cluster
    const client = await MongoClient.connect(MONGODB_URI as string);
    const db = client.db(MONGODB_DB);

    // Cache the connection
    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw new Error('Failed to connect to the database');
  }
}

/**
 * Get all modules for a user
 */
export async function getModules(userId?: string): Promise<Module[]> {
  const { db } = await connectToDatabase();
  
  try {
    // If userId is provided, filter by owner, otherwise get all modules
    const query = userId ? { ownerId: userId } : {};
    
    const modules = await db.collection('modules')
      .find(query)
      .sort({ updatedAt: -1 })
      .toArray();
    
    return JSON.parse(JSON.stringify(modules));
  } catch (error) {
    console.error('Error fetching modules:', error);
    throw new Error('Failed to fetch modules');
  }
}

/**
 * Get a single module by ID
 */
export async function getModuleById(id: string): Promise<Module | null> {
  const { db } = await connectToDatabase();
  
  try {
    const module = await db.collection('modules').findOne({
      _id: new ObjectId(id)
    });
    
    if (!module) return null;
    
    return JSON.parse(JSON.stringify(module));
  } catch (error) {
    console.error('Error fetching module:', error);
    throw new Error('Failed to fetch module');
  }
}

/**
 * Create a new module
 */
export async function createModule(moduleData: Partial<Module>): Promise<string> {
  const { db } = await connectToDatabase();
  
  try {
    const now = new Date();
    
    const result = await db.collection('modules').insertOne({
      ...moduleData,
      notes: [],
      createdAt: now,
      updatedAt: now
    });
    
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error creating module:', error);
    throw new Error('Failed to create module');
  }
}

/**
 * Add a note to a module
 */
export async function addNoteToModule(moduleId: string, noteData: Partial<Note>): Promise<string> {
  const { db } = await connectToDatabase();
  
  try {
    const noteId = new ObjectId();
    const now = new Date();
    
    await db.collection('modules').updateOne(
      { _id: new ObjectId(moduleId) },
      { 
        $push: { 
          notes: { 
            _id: noteId, 
            ...noteData,
            createdAt: now,
            updatedAt: now
          } 
        },
        $set: { updatedAt: now }
      }
    );
    
    return noteId.toString();
  } catch (error) {
    console.error('Error adding note to module:', error);
    throw new Error('Failed to add note to module');
  }
}

/**
 * Delete a note from a module
 */
export async function deleteNoteFromModule(moduleId: string, noteId: string): Promise<boolean> {
  const { db } = await connectToDatabase();
  
  try {
    const result = await db.collection('modules').updateOne(
      { _id: new ObjectId(moduleId) },
      { 
        $pull: { notes: { _id: new ObjectId(noteId) } },
        $set: { updatedAt: new Date() }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error deleting note:', error);
    throw new Error('Failed to delete note');
  }
}

/**
 * Update a module
 */
export async function updateModule(moduleId: string, updateData: Partial<Module>): Promise<boolean> {
  const { db } = await connectToDatabase();
  
  try {
    // Remove _id from update data if present
    if (updateData._id) {
      delete updateData._id;
    }
    
    const result = await db.collection('modules').updateOne(
      { _id: new ObjectId(moduleId) },
      { 
        $set: {
          ...updateData,
          updatedAt: new Date()
        }
      }
    );
    
    return result.modifiedCount > 0;
  } catch (error) {
    console.error('Error updating module:', error);
    throw new Error('Failed to update module');
  }
}

/**
 * Delete a module
 */
export async function deleteModule(moduleId: string): Promise<boolean> {
  const { db } = await connectToDatabase();
  
  try {
    const result = await db.collection('modules').deleteOne({
      _id: new ObjectId(moduleId)
    });
    
    return result.deletedCount > 0;
  } catch (error) {
    console.error('Error deleting module:', error);
    throw new Error('Failed to delete module');
  }
}