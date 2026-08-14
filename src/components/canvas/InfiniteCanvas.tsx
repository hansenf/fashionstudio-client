'use client';

import { useEffect, useRef, useCallback, useState } from 'react';
import { Stage, Layer, Rect, Transformer } from 'react-konva';
import { useCanvasStore, Layer as LayerType } from '@/lib/store/canvasStore';
import { apiFetch } from '@/lib/api/client';
import debounce from 'lodash.debounce';
import { LayerPanel } from './LayerPanel';
import { Toolbar } from './Toolbar';
import { AIChatSidebar } from '../chat/AIChatSidebar';
import Konva from 'konva';

const TEMPLATES = {
  tshirt: { width: 200, height: 240, fill: '#e5e5e5', stroke: '#333', strokeWidth: 2, cornerRadius: 20 },
  dress: { width: 180, height: 300, fill: '#d4d4d4', stroke: '#333', strokeWidth: 2 },
  hoodie: { width: 220, height: 260, fill: '#c0c0c0', stroke: '#333', strokeWidth: 2, cornerRadius: 15 },
};

export function InfiniteCanvas({ projectId, initialLayers }: { projectId: string; initialLayers: LayerType[] }) {
  const {
    layers,
    selectedId,
    addLayer,
    updateLayer,
    duplicateLayer,
    removeLayer,
    changeLayerColor,
    toggleVisibility,
    toggleLock,
    moveLayer,
    selectLayer,
    undo,
    redo,
    restoreSnapshot,
  } = useCanvasStore();

  const stageRef = useRef<Konva.Stage>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Initialize store with saved layers
  useEffect(() => {
    if (initialLayers.length > 0) {
      restoreSnapshot({ layers: initialLayers });
    } else {
      const cx = 400, cy = 300;
      addLayer({
        type: 'svg-template',
        data: { ...TEMPLATES.tshirt, x: cx - 100, y: cy - 120, name: 'T-Shirt' },
        visible: true,
        locked: false,
      });
      addLayer({
        type: 'svg-template',
        data: { ...TEMPLATES.dress, x: cx + 150, y: cy - 150, name: 'Dress' },
        visible: true,
        locked: false,
      });
      addLayer({
        type: 'svg-template',
        data: { ...TEMPLATES.hoodie, x: cx - 300, y: cy - 130, name: 'Hoodie' },
        visible: true,
        locked: false,
      });
    }
  }, []);

  // Auto-save debounced
  const debouncedSave = useCallback(
    debounce(async (state: any) => {
      setIsSaving(true);
      try {
        await apiFetch(`/projects/${projectId}`, {
          method: 'PATCH',
          body: JSON.stringify({ canvas_state: { layers: state.layers } }),
        });
      } catch (e) {
        console.error('Auto-save failed:', e);
      }
      setIsSaving(false);
    }, 5000),
    [projectId]
  );

  // Save on any layer change
  useEffect(() => {
    if (layers.length > 0) {
      debouncedSave({ layers });
    }
  }, [layers, debouncedSave]);

  // Handle canvas click to deselect
  const handleStageClick = (e: any) => {
    if (e.target === e.target.getStage()) {
      selectLayer(null);
    }
  };

  // Drag end update
  const handleDragEnd = (e: any, id: string) => {
    const node = e.target;
    updateLayer(id, { x: node.x(), y: node.y() });
  };

  // Transformer for selected layer
  const selectedLayer = layers.find((l) => l.id === selectedId);
  const transformerRef = useRef<any>(null);

  useEffect(() => {
    if (selectedLayer && transformerRef.current && stageRef.current) {
      const node = stageRef.current.findOne(`#layer-${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, selectedLayer]);

  return (
    <div className="flex flex-1 h-full">
      {/* Canvas Area */}
      <div className="flex-1 relative bg-white shadow-inner">
        <Stage
          ref={stageRef}
          width={window.innerWidth - 320}
          height={window.innerHeight - 60}
          onMouseDown={handleStageClick}
          className="bg-checkered"
        >
          <Layer>
            {layers.map((layer) => (
              <Rect
                key={layer.id}
                id={`layer-${layer.id}`}
                x={layer.data.x || 0}
                y={layer.data.y || 0}
                width={layer.data.width || 100}
                height={layer.data.height || 120}
                fill={layer.data.fill || '#cccccc'}
                stroke={layer.data.stroke || '#333'}
                strokeWidth={layer.data.strokeWidth || 2}
                cornerRadius={layer.data.cornerRadius || 0}
                draggable={!layer.locked}
                visible={layer.visible}
                onClick={() => selectLayer(layer.id)}
                onTap={() => selectLayer(layer.id)}
                onDragEnd={(e) => handleDragEnd(e, layer.id)}
                listening={!layer.locked}
                shadowColor={layer.id === selectedId ? 'rgba(128, 90, 213, 0.5)' : 'transparent'}
                shadowBlur={layer.id === selectedId ? 20 : 0}
              />
            ))}
            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
        <div className="absolute bottom-4 left-4 text-xs text-gray-400">
          {isSaving ? 'Saving...' : 'Auto-saved'}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 bg-gray-50 border-l border-gray-200 flex flex-col h-full overflow-hidden">
        <Toolbar
          onUndo={undo}
          onRedo={redo}
          onAddTemplate={(type) => {
            const template = TEMPLATES[type as keyof typeof TEMPLATES];
            if (template) {
              addLayer({
                type: 'svg-template',
                data: { ...template, x: Math.random() * 400, y: Math.random() * 300, name: type },
                visible: true,
                locked: false,
              });
            }
          }}
          selectedId={selectedId}
          onChangeColor={(color) => {
            if (selectedId) changeLayerColor(selectedId, color);
          }}
          onDuplicate={() => {
            if (selectedId) duplicateLayer(selectedId);
          }}
          onDelete={() => {
            if (selectedId) removeLayer(selectedId);
          }}
        />
        <LayerPanel
          layers={layers}
          selectedId={selectedId}
          onSelect={selectLayer}
          onToggleVisibility={toggleVisibility}
          onToggleLock={toggleLock}
          onMoveLayer={moveLayer}
          onDuplicate={duplicateLayer}
          onDelete={removeLayer}
        />
        <AIChatSidebar
          layers={layers}
          onAction={(action) => {
            if (action.function === 'changeColor') {
              changeLayerColor(action.args.layerId, action.args.color);
            } else if (action.function === 'duplicateLayer') {
              duplicateLayer(action.args.layerId);
            } else if (action.function === 'addLayer') {
              addLayer({
                type: 'generated-image',
                data: { ...action.args, x: 200, y: 200 },
                visible: true,
                locked: false,
              });
            }
          }}
        />
      </div>
    </div>
  );
}