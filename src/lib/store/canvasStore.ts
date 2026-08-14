import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface Layer {
  id: string;
  type: string;
  data: any;
  zIndex: number;
  visible: boolean;
  locked: boolean;
}

interface CanvasState {
  layers: Layer[];
  selectedId: string | null;
  history: { layers: Layer[] }[];
  historyIndex: number;
  
  // Actions
  addLayer: (layer: Omit<Layer, 'id'>) => void;
  updateLayer: (id: string, data: any) => void;
  removeLayer: (id: string) => void;
  duplicateLayer: (id: string) => void;
  changeLayerColor: (id: string, color: string) => void;
  toggleVisibility: (id: string) => void;
  toggleLock: (id: string) => void;
  moveLayer: (id: string, newZIndex: number) => void;
  selectLayer: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  restoreSnapshot: (state: { layers: Layer[] }) => void;
}

const pushHistory = (state: any) => {
  const snapshot = { layers: JSON.parse(JSON.stringify(state.layers)) };
  const newHistory = state.history.slice(0, state.historyIndex + 1);
  newHistory.push(snapshot);
  return {
    history: newHistory,
    historyIndex: newHistory.length - 1,
  };
};

export const useCanvasStore = create<CanvasState>()(
  devtools(
    (set, get) => ({
      layers: [],
      selectedId: null,
      history: [{ layers: [] }],
      historyIndex: 0,

      addLayer: (layer) =>
        set((state) => {
          const newLayer = {
            ...layer,
            id: crypto.randomUUID(),
            zIndex: state.layers.length,
          };
          const newLayers = [...state.layers, newLayer];
          const historyUpdate = pushHistory({ ...state, layers: newLayers });
          return {
            layers: newLayers,
            ...historyUpdate,
            selectedId: newLayer.id,
          };
        }),

      updateLayer: (id, data) =>
        set((state) => {
          const newLayers = state.layers.map((l) =>
            l.id === id ? { ...l, data: { ...l.data, ...data } } : l
          );
          const historyUpdate = pushHistory({ ...state, layers: newLayers });
          return { layers: newLayers, ...historyUpdate };
        }),

      removeLayer: (id) =>
        set((state) => {
          const newLayers = state.layers.filter((l) => l.id !== id);
          const historyUpdate = pushHistory({ ...state, layers: newLayers });
          return {
            layers: newLayers,
            ...historyUpdate,
            selectedId: state.selectedId === id ? null : state.selectedId,
          };
        }),

      duplicateLayer: (id) =>
        set((state) => {
          const original = state.layers.find((l) => l.id === id);
          if (!original) return state;
          const newLayer = {
            ...original,
            id: crypto.randomUUID(),
            data: { ...original.data, x: (original.data.x || 0) + 20, y: (original.data.y || 0) + 20 },
            zIndex: state.layers.length,
          };
          const newLayers = [...state.layers, newLayer];
          const historyUpdate = pushHistory({ ...state, layers: newLayers });
          return { layers: newLayers, ...historyUpdate, selectedId: newLayer.id };
        }),

      changeLayerColor: (id, color) =>
        set((state) => {
          const newLayers = state.layers.map((l) =>
            l.id === id ? { ...l, data: { ...l.data, fill: color } } : l
          );
          const historyUpdate = pushHistory({ ...state, layers: newLayers });
          return { layers: newLayers, ...historyUpdate };
        }),

      toggleVisibility: (id) =>
        set((state) => {
          const newLayers = state.layers.map((l) =>
            l.id === id ? { ...l, visible: !l.visible } : l
          );
          const historyUpdate = pushHistory({ ...state, layers: newLayers });
          return { layers: newLayers, ...historyUpdate };
        }),

      toggleLock: (id) =>
        set((state) => {
          const newLayers = state.layers.map((l) =>
            l.id === id ? { ...l, locked: !l.locked } : l
          );
          const historyUpdate = pushHistory({ ...state, layers: newLayers });
          return { layers: newLayers, ...historyUpdate };
        }),

      moveLayer: (id, newZIndex) =>
        set((state) => {
          const layer = state.layers.find((l) => l.id === id);
          if (!layer) return state;
          const others = state.layers.filter((l) => l.id !== id);
          const index = Math.min(Math.max(newZIndex, 0), others.length);
          const newLayers = [...others.slice(0, index), layer, ...others.slice(index)];
          newLayers.forEach((l, i) => (l.zIndex = i));
          const historyUpdate = pushHistory({ ...state, layers: newLayers });
          return { layers: newLayers, ...historyUpdate };
        }),

      selectLayer: (id) => set({ selectedId: id }),

      undo: () =>
        set((state) => {
          if (state.historyIndex <= 0) return state;
          const newIndex = state.historyIndex - 1;
          return {
            layers: state.history[newIndex].layers,
            historyIndex: newIndex,
          };
        }),

      redo: () =>
        set((state) => {
          if (state.historyIndex >= state.history.length - 1) return state;
          const newIndex = state.historyIndex + 1;
          return {
            layers: state.history[newIndex].layers,
            historyIndex: newIndex,
          };
        }),

      restoreSnapshot: (snapshot) =>
        set((state) => {
          const historyUpdate = pushHistory({ ...state, layers: snapshot.layers });
          return { layers: snapshot.layers, ...historyUpdate };
        }),
    }),
    { name: 'canvas-store' }
  )
);