import { Component, OnInit } from '@angular/core';
import { GoogleMapsModule } from '@angular/google-maps';
import { OurMapService, MemoryPin, NewPinDto, MemoryImage } from '../services/our-map.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-our-map',
  standalone: true,
  imports: [GoogleMapsModule, FormsModule, CommonModule, RouterLink],
  templateUrl: './our-map.component.html',
  styleUrls: ['./our-map.component.scss']
})
export class OurMapComponent implements OnInit {
  menuOpen = false;
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  logout() { console.log('logout'); }
navLinks = [
  { name: 'Home', url: '/home' },
  { name: 'Draw', url: '/draw' },
  { name: 'Trips', url: '/trip-list' },
  { name: 'Visits', url: '/visits' },
  { name: 'Notes', url: '/notes' },
  { name: 'Words', url: '/words' },
  { name: 'Map', url: '/our-map' },
  { name: 'Mystery', url: '/mystery' }
];

  center = { lat: 48, lng: 16 };
  zoom = 4;
  mapOptions: google.maps.MapOptions = { disableDoubleClickZoom: false };

  memoryPins: MemoryPin[] = [];
  selectedMarker: MemoryPin | null = null;

  adding = false;
  newPin: NewPinDto = { title: '', text: '', lat: 0, lng: 0, images: [] };

  constructor(private mapService: OurMapService) {}

  ngOnInit() {
    this.loadPins();
  }

  private loadPins() {
    this.mapService.getPins().subscribe(pins => {
      this.memoryPins = pins.map(pin => ({
        ...pin,
        images: pin.images.map((img: MemoryImage | string) => {
          // handle string or object
          const base64 = typeof img === 'string' ? img : img.base64Data;
          return base64.startsWith('data:image') ? base64 : `data:image/jpeg;base64,${base64}`;
        })
      }));
    });
  }

  mapClicked(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;
    this.newPin = {
      title: '',
      text: '',
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
      images: []
    };
    this.adding = true;
  }

  markerClicked(pin: MemoryPin) {
    this.selectedMarker = pin;
  }

  closePinModal() {
    this.selectedMarker = null;
  }

  listClicked(pin: MemoryPin) {
    this.markerClicked(pin);
  }
// Returns safe src for string | MemoryImage
getImageSrc(img: string | MemoryImage): string {
  if (typeof img === 'string') return img;
  return `data:image/jpeg;base64,${img.base64Data}`;
}

// When user clicks an image to view fullscreen
viewingImage: string | MemoryImage | null = null;
openImageViewer(img: string | MemoryImage) {
  this.viewingImage = img;
}
closeImageViewer() {
  this.viewingImage = null;
}
isMemoryImage(image: string | MemoryImage): image is MemoryImage {
  return (image as MemoryImage).base64Data !== undefined;
}
  savePin() {
    this.mapService.addPin(this.newPin).subscribe(() => {
      this.memoryPins.push({
        ...this.newPin,
        images: this.newPin.images.map(img =>
          typeof img === 'string' ? img : `data:image/jpeg;base64,${img.base64Data}`
        )
      });
      this.newPin = { title: '', text: '', lat: 0, lng: 0, images: [] };
      this.adding = false;
    });
  }

  async addImageFromPhone(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    for (const file of Array.from(input.files)) {
      const base64 = await this.toBase64(file);
      this.newPin.images.push({
        fileName: file.name,
        base64Data: base64.split(',')[1]
      });
    }

    input.value = '';
  }

  private toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = err => reject(err);
    });
  }

  deletePin(pin: MemoryPin) {
  if (!pin.id) return;
  
  if (!confirm(`Are you sure you want to delete "${pin.title}"?`)) return;

  this.mapService.deletePin(pin.id).subscribe({
    next: () => {
      // Remove from local array to update UI immediately
      this.memoryPins = this.memoryPins.filter(p => p.id !== pin.id);
      // If the deleted pin was selected, close modal
      if (this.selectedMarker?.id === pin.id) this.selectedMarker = null;
    },
    error: err => console.error('Failed to delete pin', err)
  });
}
}
