import AsyncStorage from '@react-native-async-storage/async-storage';
import type { StateStorage } from 'zustand/middleware';

// wrapper นี้ทำให้ zustand persist middleware อ่าน/เขียนลง AsyncStorage ได้
// (แอพนี้เก็บข้อมูลแบบ offline ทั้งหมด ไม่มี backend)
export const zustandStorage: StateStorage = {
  getItem: async (name) => {
    return (await AsyncStorage.getItem(name)) ?? null;
  },
  setItem: async (name, value) => {
    await AsyncStorage.setItem(name, value);
  },
  removeItem: async (name) => {
    await AsyncStorage.removeItem(name);
  },
};