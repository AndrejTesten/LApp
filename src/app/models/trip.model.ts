export interface Trip {
  id: number;
  title: string;
  route: { lat: number; lng: number; degree?: number }[];
}
