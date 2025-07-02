import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface FurnitureItem {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
}

export interface Room {
  id: string;
  name: string;
  imageUri: string | null;
  timestamp: string;
  furniture: FurnitureItem[];
}

interface RoomState {
  rooms: Room[];
  fetchRooms: () => Promise<void>;
  getRoom: (id: string) => Room | null;
  addRoom: (room: Room) => Promise<void>;
  updateRoom: (id: string, updatedRoom: Room) => void;
  deleteRoom: (id: string) => void;
}

export const useRoomStore = create<RoomState>()(
  persist(
    (set, get) => ({
      rooms: [],
      
      fetchRooms: async () => {
        // In a real app, this would fetch from Supabase or SQLite
        // For now, we'll just return the current state
        await new Promise(resolve => setTimeout(resolve, 500));
        return;
      },
      
      getRoom: (id) => {
        const { rooms } = get();
        return rooms.find(room => room.id === id) || null;
      },
      
      addRoom: async (room) => {
        // In a real app, this would add to Supabase and SQLite
        await new Promise(resolve => setTimeout(resolve, 500));
        
        set(state => ({
          rooms: [room, ...state.rooms],
        }));
      },
      
      updateRoom: (id, updatedRoom) => {
        set(state => ({
          rooms: state.rooms.map(room => 
            room.id === id ? updatedRoom : room
          ),
        }));
      },
      
      deleteRoom: (id) => {
        set(state => ({
          rooms: state.rooms.filter(room => room.id !== id),
        }));
      },
    }),
    {
      name: "room-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);