// models/memory-pin.model.ts
export interface MemoryPin {
  id?: string;
  lat: number;
  lng: number;
  title: string;
  text: string;
  images: string[]; // URLs
  date?: string;
}
