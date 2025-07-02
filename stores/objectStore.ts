import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface DetectedObject {
  id: string;
  text: string;
  brand: string | null;
  category: string | null;
  color: string | null;
  shape: string | null;
  size: string | null;
  latitude: number | null;
  longitude: number | null;
  currentCity: string | null;
  currentState: string | null;
  timestamp: string;
  imageUri: string;
}

interface ObjectState {
  objects: DetectedObject[];
  fetchObjects: () => Promise<void>;
  getObject: (id: string) => DetectedObject | null;
  addObject: (object: DetectedObject) => Promise<void>;
  updateObject: (id: string, updatedObject: DetectedObject) => void;
  deleteObject: (id: string) => void;
}

export const useObjectStore = create<ObjectState>()(
  persist(
    (set, get) => ({
      objects: [],
      
      fetchObjects: async () => {
        // In a real app, this would fetch from Supabase or SQLite
        // For now, we'll just return the current state
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      },
      
      getObject: (id) => {
        const { objects } = get();
        return objects.find(object => object.id === id) || null;
      },
      
      addObject: async (object) => {
        // In a real app, this would add to Supabase and SQLite
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => ({
          objects: [object, ...state.objects],
        }));
      },
      
      updateObject: (id, updatedObject) => {
        set(state => ({
          objects: state.objects.map(object => 
            object.id === id ? updatedObject : object
          ),
        }));
      },
      
      deleteObject: (id) => {
        set(state => ({
          objects: state.objects.filter(object => object.id !== id),
        }));
      },
    }),
    {
      name: "object-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);