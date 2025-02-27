// File location: /src/app/api/uploads/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addNoteToModule } from '@/lib/db';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// This function would be adapted for a production environment
// to store files in a cloud storage like AWS S3
async function saveFile(file, fileName) {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Ensure the directory exists
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
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const moduleId = formData.get('moduleId');
    
    if (!file || !moduleId) {
      return NextResponse.json(
        { error: 'File or moduleId missing' },
        { status: 400 }
      );
    }
    
    const fileName = file.name;
    const fileType = fileName.endsWith('.md') ? 'markdown' : 'freeform';
    
    let noteData = {};
    
    if (fileType === 'markdown') {
      // For markdown files, we read the content
      const content = await file.text();
      noteData = {
        type: 'markdown',
        fileName,
        content,
        createdAt: new Date()
      };
    } else {
      // For other files, we save the file and store the path
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
      { error: 'Error processing upload' },
      { status: 500 }
    );
  }
}