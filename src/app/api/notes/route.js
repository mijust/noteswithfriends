// File location: /src/app/api/notes/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { addNoteToModule, deleteNoteFromModule, getModuleById } from '@/lib/db';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try {
    const data = await request.json();
    const { moduleId, type, content, fileName } = data;
    
    if (!moduleId || !type || !fileName) {
      return NextResponse.json(
        { error: 'Module ID, type, and file name are required' },
        { status: 400 }
      );
    }
    
    // Check if the user has permission to add notes to this module
    const module = await getModuleById(moduleId);
    
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }
    
    // Allow the owner and collaborators to add notes
    const isOwnerOrCollaborator = 
      module.ownerId === session.user.id || 
      (module.collaborators && module.collaborators.includes(session.user.id));
    
    if (!isOwnerOrCollaborator) {
      return NextResponse.json(
        { error: 'Not authorized to add notes to this module' },
        { status: 403 }
      );
    }
    
    const noteData = {
      type,
      fileName,
      content: type === 'markdown' ? content : undefined,
      fileUrl: type === 'freeform' ? data.fileUrl : undefined,
      createdAt: new Date()
    };
    
    const noteId = await addNoteToModule(moduleId, noteData);
    
    return NextResponse.json({ success: true, noteId });
  } catch (error) {
    console.error('Error adding note:', error);
    return NextResponse.json(
      { error: 'Error adding note' },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try {
    const { searchParams } = new URL(request.url);
    const moduleId = searchParams.get('moduleId');
    const noteId = searchParams.get('noteId');
    
    if (!moduleId || !noteId) {
      return NextResponse.json(
        { error: 'Module ID and Note ID are required' },
        { status: 400 }
      );
    }
    
    // Check if the user has permission to delete notes from this module
    const module = await getModuleById(moduleId);
    
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }
    
    // Allow the owner and collaborators to delete notes
    const isOwnerOrCollaborator = 
      module.ownerId === session.user.id || 
      (module.collaborators && module.collaborators.includes(session.user.id));
    
    if (!isOwnerOrCollaborator) {
      return NextResponse.json(
        { error: 'Not authorized to delete notes from this module' },
        { status: 403 }
      );
    }
    
    const success = await deleteNoteFromModule(moduleId, noteId);
    
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting note:', error);
    return NextResponse.json(
      { error: 'Error deleting note' },
      { status: 500 }
    );
  }
}