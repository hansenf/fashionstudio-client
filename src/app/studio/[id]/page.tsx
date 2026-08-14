import { apiFetch } from '@/lib/api/client';
import { InfiniteCanvas } from '@/components/canvas/InfiniteCanvas';
import { notFound } from 'next/navigation';

async function getProject(id: string) {
  try {
    return await apiFetch(`/projects/${id}`);
  } catch {
    return null;
  }
}

export default async function StudioPage({ params }: { params: { id: string } }) {
  const project = await getProject(params.id);
  if (!project) notFound();
  
  return (
    <InfiniteCanvas 
      projectId={project.id} 
      initialLayers={project.canvas_state?.layers || []} 
    />
  );
}