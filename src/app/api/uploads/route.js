import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { addNoteToModule } from '../../../lib/db';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// Diese Funktion würde für eine Produktionsumgebung angepasst werden,
// um Dateien in einem Cloud-Speicher wie AWS S3 zu speichern
async function saveFile(file, fileName) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Stelle sicher, dass das Verzeichnis existiert
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  const uniqueFileName = `${uuidv4()}-${fileName}`;
  const filePath = path.join(uploadsDir, uniqueFileName);
  
  fs.writeFileSync(filePath, buffer);
  
  return `/uploads/${uniqueFileName}`;
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Nicht authentifiziert' },
      { status: 401 }
    );
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const moduleId = formData.get('moduleId');
    
    if (!file || !moduleId) {
      return NextResponse.json(
        { error: 'Datei oder Modul-ID fehlt' },
        { status: 400 }
      );
    }
    
    const fileName = file.name;
    const fileType = fileName.endsWith('.md') ? 'markdown' : 'freeform';
    
    let noteData = {};
    
    if (fileType === 'markdown') {
      // Für Markdown-Dateien lesen wir den Inhalt
      const content = await file.text();
      noteData = {
        type: 'markdown',
        fileName,
        content,
        createdAt: new Date()
      };
    } else {
      // Für Freeform-Dateien speichern wir die Datei und den Pfad
      const fileUrl = await saveFile(file, fileName);
      noteData = {
        type: 'freeform',
        fileName,
        fileUrl,
        createdAt: new Date()
      };
    }
    
    const noteId = await addNoteToModule(moduleId, noteData);
    
    return NextResponse.json({ success: true, noteId });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Fehler beim Verarbeiten des Uploads' },
      { status: 500 }
    );
  }
}