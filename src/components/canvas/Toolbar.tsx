'use client';

import { Undo2, Redo2, Palette, Copy, Trash2 } from 'lucide-react';

export function Toolbar({
  onUndo,
  onRedo,
  onAddTemplate,
  selectedId,
  onChangeColor,
  onDuplicate,
  onDelete,
}: {
  onUndo: () => void;
  onRedo: () => void;
  onAddTemplate: (type: string) => void;
  selectedId: string | null;
  onChangeColor: (color: string) => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2 p-2 border-b border-gray-200 bg-white flex-wrap">
      <button onClick={onUndo} className="p-1.5 rounded hover:bg-gray-100" title="Undo (Ctrl+Z)">
        <Undo2 className="w-4 h-4" />
      </button>
      <button onClick={onRedo} className="p-1.5 rounded hover:bg-gray-100" title="Redo (Ctrl+Y)">
        <Redo2 className="w-4 h-4" />
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      <button onClick={() => onAddTemplate('tshirt')} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
        + T-Shirt
      </button>
      <button onClick={() => onAddTemplate('dress')} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
        + Dress
      </button>
      <button onClick={() => onAddTemplate('hoodie')} className="px-2 py-1 text-xs bg-gray-100 rounded hover:bg-gray-200">
        + Hoodie
      </button>
      <div className="w-px h-6 bg-gray-300 mx-1" />
      {selectedId && (
        <>
          <label className="flex items-center gap-1 text-xs">
            <Palette className="w-4 h-4" />
            <input
              type="color"
              onChange={(e) => onChangeColor(e.target.value)}
              className="w-6 h-6 border-0 p-0 cursor-pointer"
              title="Change color"
            />
          </label>
          <button onClick={onDuplicate} className="p-1.5 rounded hover:bg-gray-100" title="Duplicate">
            <Copy className="w-4 h-4" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded hover:bg-red-100 text-red-600" title="Delete">
            <Trash2 className="w-4 h-4" />
          </button>
        </>
      )}
    </div>
  );
}