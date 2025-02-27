// File location: /src/app/api/modules/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createModule, getModuleById, updateModule, deleteModule } from '@/lib/db';

export async function POST(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try {
    const { title, description } = await request.json();
    
    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }
    
    const moduleId = await createModule({
      title,
      description: description || '',
      ownerId: session.user.id,
      isPublic: false,
      tags: [],
    });
    
    return NextResponse.json({ success: true, moduleId });
  } catch (error) {
    console.error('Error creating module:', error);
    return NextResponse.json(
      { error: 'Error creating module' },
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }
  
  try {
    const { moduleId, title, description, isPublic, tags } = await request.json();
    
    if (!moduleId || !title) {
      return NextResponse.json(
        { error: 'Module ID and title are required' },
        { status: 400 }
      );
    }
    
    // Check if the user is the owner of the module
    const module = await getModuleById(moduleId);
    
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }
    
    if (module.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to edit this module' },
        { status: 403 }
      );
    }
    
    const success = await updateModule(moduleId, {
      title,
      description,
      isPublic,
      tags,
    });
    
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error updating module:', error);
    return NextResponse.json(
      { error: 'Error updating module' },
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
    const moduleId = searchParams.get('id');
    
    if (!moduleId) {
      return NextResponse.json(
        { error: 'Module ID is required' },
        { status: 400 }
      );
    }
    
    // Check if the user is the owner of the module
    const module = await getModuleById(moduleId);
    
    if (!module) {
      return NextResponse.json(
        { error: 'Module not found' },
        { status: 404 }
      );
    }
    
    if (module.ownerId !== session.user.id) {
      return NextResponse.json(
        { error: 'Not authorized to delete this module' },
        { status: 403 }
      );
    }
    
    const success = await deleteModule(moduleId);
    
    return NextResponse.json({ success });
  } catch (error) {
    console.error('Error deleting module:', error);
    return NextResponse.json(
      { error: 'Error deleting module' },
      { status: 500 }
    );
  }
}