'use client';

import { Layer } from '@/lib/store/canvasStore';
import { GripVertical, Eye, EyeOff, Lock, LockOpen, Trash2, Copy } from 'lucide-react';

export function LayerPanel({
  layers,
  selectedId,
  onSelect,
  onToggleVisibility,
  onToggleLock,
  onMoveLayer,
  onDuplicate,
  onDelete,
}: {
  layers: Layer[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onToggleLock: (id: string) => void;
  onMoveLayer: (id: string, newIndex: number) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-2 border-t border-gray-200">
      <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-2">Layers</h3>
      <div className="space-y-1">
        {[...layers]
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((layer) => (
            <div
              key={layer.id}
              className={`group flex items-center gap-2 px-2 py-1.5 rounded-md cursor-pointer hover:bg-gray-200 transition-colors ${
                selectedId === layer.id ? 'bg-purple-100 border border-purple-300' : ''
              }`}
              onClick={() => onSelect(layer.id)}
            >
              <GripVertical className="w-3 h-3 text-gray-400 cursor-grab" />
              <button
                onClick={(e) => { e.stopPropagation(); onToggleVisibility(layer.id); }}
                className="text-gray-500 hover:text-gray-700"
              >
                {layer.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <span className="flex-1 text-sm truncate">
                {layer.data?.name || layer.type || 'Layer'}
              </span>
              <button
                onClick={(e) => { e.stopPropagation(); onToggleLock(layer.id); }}
                className="text-gray-500 hover:text-gray-700"
              >
                {layer.locked ? <Lock className="w-3 h-3" /> : <LockOpen className="w-3 h-3" />}
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDuplicate(layer.id); }}
                className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); onDelete(layer.id); }}
                className="text-gray-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
      </div>
    </div>
  );
}