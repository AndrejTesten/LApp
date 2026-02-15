import { Component, ElementRef, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { DrawingsService } from '../services/drawings.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-draw',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, RouterLink],
  templateUrl: './draw.component.html',
  styleUrls: ['./draw.component.scss']
})
export class DrawComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;
  private ctx!: CanvasRenderingContext2D;
  private drawing = false;
savedDrawing: string | null = null;

  brushColor = '#ff6f91';
  brushSize = 5;
  erasing = false;

  private lastX = 0;
  private lastY = 0;

  // NAVBAR STATE
  menuOpen = false;

  // USER ID - replace with your actual user logic
  userId: number = 0;

  constructor(private drawService: DrawingsService, private auth: AuthService) {  this.userId = this.auth.getUserId() || 0;
}

  ngAfterViewInit() {
    this.setupCanvas();
    this.loadDrawing(); // load saved drawing on init
  }

  @HostListener('window:resize')
  onResize() {
    this.resizeCanvas();
  }

  // --------------------------
  // NAVBAR METHODS
  // --------------------------
  toggleMenu() { this.menuOpen = !this.menuOpen; }
  closeMenu() { this.menuOpen = false; }
  logout() { }

  // --------------------------
  // CANVAS METHODS
  // --------------------------
  private setupCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx = canvas.getContext('2d')!;
    this.resizeCanvas();

    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';
    this.ctx.strokeStyle = this.brushColor;
    this.ctx.lineWidth = this.brushSize;
  }

 private resizeCanvas() {
  const canvas = this.canvasRef.nativeElement;

  // Save current drawing temporarily
  const data = canvas.toDataURL();

  // Resize canvas to current window
  canvas.width = window.innerWidth * 0.95;
  canvas.height = window.innerHeight * 0.6;

  // Redraw previous drawing (if any)
  const img = new Image();
  img.src = data;
  img.onload = () => {
    this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    // If there's a saved drawing from DB, draw it again on top
    if (this.savedDrawing) {
      const savedImg = new Image();
      savedImg.src = this.savedDrawing;
      savedImg.onload = () => this.ctx.drawImage(savedImg, 0, 0, canvas.width, canvas.height);
    }
  };
}


  startDraw(event: MouseEvent | TouchEvent) {
    this.drawing = true;
    const pos = this.getPos(event);
    this.lastX = pos.x;
    this.lastY = pos.y;
    event.preventDefault();
  }

  draw(event: MouseEvent | TouchEvent) {
    if (!this.drawing) return;

    const pos = this.getPos(event);
    this.ctx.strokeStyle = this.erasing ? '#ffffff' : this.brushColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(pos.x, pos.y);
    this.ctx.stroke();

    this.lastX = pos.x;
    this.lastY = pos.y;
    event.preventDefault();
  }

  stopDraw() { this.drawing = false; }

  private getPos(event: MouseEvent | TouchEvent) {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    let clientX: number, clientY: number;
    if (event instanceof MouseEvent) {
      clientX = event.clientX;
      clientY = event.clientY;
    } else {
      const touch = event.touches[0];
      clientX = touch.clientX;
      clientY = touch.clientY;
    }

    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  }

  toggleEraser() { this.erasing = !this.erasing; }

  clearCanvas() {
    const canvas = this.canvasRef.nativeElement;
    this.ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  downloadCanvas() {
    const link = document.createElement('a');
    link.href = this.canvasRef.nativeElement.toDataURL();
    link.download = 'drawing.png';
    link.click();
  }

  // --------------------------
  // PERSISTENCE METHODS
  // --------------------------

private loadDrawing() {
  this.drawService.getDrawing(this.userId).subscribe({
    next: data => {


      if (!data) return;
      this.savedDrawing = data; // store for redraw after resize

      const img = new Image();
      img.src = data;
      img.onload = () => {
        const canvas = this.canvasRef.nativeElement;
        this.ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      };
    },
    error: err => console.log('No saved drawing found')
  });
}


  saveDrawing() {
    const dataUrl = this.canvasRef.nativeElement.toDataURL();
    this.drawService.saveDrawing({ userId: this.userId, drawingData: dataUrl }).subscribe({
      next: () => console.log('Drawing saved!'),
      error: err => console.error('Error saving drawing', err)
    });
  }
}
