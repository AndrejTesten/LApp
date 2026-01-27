import { Component, AfterViewInit, ElementRef, ViewChild, HostListener, OnInit } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { AnimationMixer, AnimationAction } from 'three';
import { MysteryService } from '../services/mystery.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-mystery-box',
  templateUrl: './mystery-box.component.html',
  styleUrls: ['./mystery-box.component.scss'],
  imports: [CommonModule]
})
export class MysteryBoxComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLDivElement>;
  @ViewChild('speechBubble') speechBubbleRef!: ElementRef<HTMLDivElement>;

  instructionText = 'Tap the chest to see a surprise!';
  intermediateMessageShown = false;

  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private renderer!: THREE.WebGLRenderer;

  private chest!: THREE.Object3D;
  private chestMixer!: AnimationMixer;
  private chestAction!: AnimationAction;

  private penguin!: THREE.Object3D;
  private penguinLoaded = false;
  private penguinRoutineActive = false;
  showBackButton = false;

  clickCount = 0;
  messages: string[] = [
    'Hello Laila, I am bringing you a message from Andrej!',
    'Here is another message for you 😉' // <--- will be replaced by backend
  ];

  backendMessage: any;

  constructor(private mysteryService: MysteryService, private auth: AuthService) {}

ngOnInit() {
  console.log("Checking backend for second message…");
    var userId = this.auth.getUserId()!;

  this.mysteryService.getSecondMessage().subscribe({
    next: msg => {
      if (msg && msg.message && !msg.message.includes("traveling to Slovenia")) {
        this.backendMessage = msg.message;
        console.log("Backend message:", this.backendMessage);
      } else {
        this.backendMessage = null;

        // Show traveling message immediately
        this.instructionText = "🐧 Penguin is traveling to Slovenia for more messages 💌, he will be back soon.";

        // Prevent clicks on box
        this.clickCount = 99;

        // Show Back button immediately
        this.showBackButton = true;
      }
    },
    error: () => {
      this.backendMessage = null;
      this.instructionText = "🐧 Penguin is traveling to Slovenia for more messages 💌, he will be back soon.";
      this.clickCount = 99;

      this.showBackButton = true;
    }
  });
}


  ngAfterViewInit() {
    this.initThree();
    this.animate();
  }

initThree() {
  const container = this.canvasRef.nativeElement;
  const width = container.clientWidth;
  const height = container.clientHeight;

  // Scene
  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color(0xfacad6);

  // Camera: slightly zoomed out and fixed
  this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
this.camera.position.set(0, 2.8, 6.8); 
this.camera.lookAt(0, 0, 0); // make sure camera looks at scene center

  // Renderer: size matches container
  this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  this.renderer.setSize(width, height);
  this.renderer.setPixelRatio(window.devicePixelRatio); // sharper on retina
  container.appendChild(this.renderer.domElement);

  // Lights
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.set(5, 10, 7.5);
  this.scene.add(light);
  this.scene.add(new THREE.AmbientLight(0xffffff, 0.6));

  // No OrbitControls needed since camera is fixed
  // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
  // this.controls.enabled = false;

  const loader = new GLTFLoader();

  // Load chest
  loader.load('assets/object/chest/scene.gltf', gltf => {
    this.chest = gltf.scene;
    this.chest.scale.set(3, 3, 3);
    this.chest.rotation.y = Math.PI;
    this.scene.add(this.chest);

    if (gltf.animations.length > 0) {
      this.chestMixer = new AnimationMixer(this.chest);
      this.chestAction = this.chestMixer.clipAction(gltf.animations[0]);
      this.chestAction.loop = THREE.LoopOnce;
      this.chestAction.clampWhenFinished = true;
    }
  });

  // Load penguin hidden
  loader.load('assets/object/penguin.glb', gltf => {
    this.penguin = gltf.scene;
    this.penguin.scale.set(6, 6, 6);
    this.penguin.visible = false;
    this.scene.add(this.penguin);
    this.penguinLoaded = true;
  });
}

// Handle window resize
@HostListener('window:resize')
onResize() {
  const container = this.canvasRef.nativeElement;
  const width = container.clientWidth;
  const height = container.clientHeight;

  this.camera.aspect = width / height;
  this.camera.updateProjectionMatrix();

  this.renderer.setSize(width, height);
}

  animate = () => {
    requestAnimationFrame(this.animate);
    if (this.chestMixer) this.chestMixer.update(0.016);
    this.renderer.render(this.scene, this.camera);

    // Update speech bubble
if (this.penguin && this.penguin.visible && this.speechBubbleRef) {
  const pos = this.toScreenPosition(this.penguin);
  const bubble = this.speechBubbleRef.nativeElement;

  // Place bubble directly below penguin
  bubble.style.left = `${pos.x}px`;
  bubble.style.top = `${pos.y - 20}px`; // adjust +50 as needed
  bubble.style.transform = 'translateX(-50%)'; // center horizontally only
}
  };

handleClick() {
  if (!this.chest || !this.penguinLoaded) return;

  if (this.clickCount === 0) {
    // First click: open chest
    this.clickCount++;
    this.instructionText = 'Click again to get your special message 💌';
    this.openChestAndPenguinOut();
  } else if (this.clickCount === 1) {
    // Second click: penguin jumps back into chest first
    this.clickCount++;
    this.penguinBackInChest(() => {
      // After penguin is back inside, show intermediate message
      setTimeout(() => {
      this.instructionText = "Wait! He's looking for it… It's there somewhere, sorry 😅";
      }, 1000);

      // Shake chest for 2 seconds while looking
      this.shakeChest(() => {}, 3000);

      // After 2 seconds, penguin jumps out again
      setTimeout(() => {
        this.instructionText = 'Penguin will be back soon with more surprises 🐧';
        this.openChestAndPenguinOut(true); // second jump
      }, 3000);
    });
  }
}






  private openChestAndPenguinOut(isSecondMessage = false) {
    // Shake chest a bit
    this.shakeChest(() => {
      // Play chest open animation forward
      if (this.chestAction) {
        this.chestAction.reset();
        this.chestAction.timeScale = 1;
        this.chestAction.play();
      }

      // Show penguin in front
      setTimeout(() => {
        this.showPenguin(isSecondMessage);
      }, 500);
    });
  }

private penguinBackInChest(callback?: () => void) {
  if (!this.penguin || !this.chest) return;

  // Step 1: Open chest (if chestAction exists)
  if (this.chestAction) {
    this.chestAction.reset();
    this.chestAction.timeScale = 1; // play forward
    this.chestAction.play();
  }

  // Step 2: Small delay before penguin jumps back
  setTimeout(() => {
    const chestPos = this.chest.position.clone();

    // Rotate penguin toward chest
    this.penguin.lookAt(chestPos);

    // Jump penguin to chest
    this.jumpObject(this.penguin, chestPos, () => {
      // Step 3: Close chest after penguin reaches
      if (this.chestAction) {
        this.chestAction.timeScale = -1; // reverse
        this.chestAction.reset();
        this.chestAction.play();
      }

      // Hide speech bubble
      this.speechBubbleRef.nativeElement.classList.remove('visible');

      // Optional: small shake and callback
      this.shakeChest(callback);
    });
  }, 400); // 400ms delay before penguin jumps back
}



private showPenguin(isSecondMessage = false) {
  if (!this.penguin || !this.chest) return;

  this.penguin.visible = true;
  this.penguin.rotation.set(0, 0, 0);

  const frontOffset = -2;
  const targetPos = new THREE.Vector3(
    this.chest.position.x,
    this.chest.position.y,
    this.chest.position.z - frontOffset
  );

  // Jump out of chest
  this.jumpObject(this.penguin, targetPos, () => {
    if (isSecondMessage) {
      // Start the cute routine
      this.startPenguinRoutine(this.penguin);
    } else {
      // First message: small single jump
      this.happyJump(this.penguin, 2, 0.5);
    }
  });

  // Show bubble
  const bubble = this.speechBubbleRef.nativeElement;
  bubble.innerText = isSecondMessage
    ? this.backendMessage || "🐧 Penguin is traveling to Slovenia for more messages 💌, he will be back soon."
    : this.messages[0]; // first message always from array
  bubble.style.transform = `translate(-50%, 0%)`;
  bubble.classList.add('visible');
}



private startPenguinRoutine(obj: THREE.Object3D) {
  if (this.penguinRoutineActive) return; // already running
  this.penguinRoutineActive = true;

  const startY = obj.position.y;
  let t = 0;
  const jumpDuration = 2; // 2 seconds of small jumps
  const jumpHeight = 0.5;

  const routineStep = () => {
    if (!this.penguinRoutineActive) return;

    t += 0.016; // 60fps

    if (t < jumpDuration) {
      // Small cute jump animation
      obj.position.y = startY + Math.sin((t / jumpDuration) * Math.PI * 4) * jumpHeight;
      obj.rotation.y = Math.sin((t / jumpDuration) * Math.PI * 4) * 0.1; // slight wiggle
      requestAnimationFrame(routineStep);
    } else {
      // After jumps, do a 360° rotation
      this.spinPenguin(obj, () => {
        // Repeat the routine after a short pause
        setTimeout(() => {
          t = 0;
          routineStep();
        }, 500);
      });
      this.showBackButton = true;

    }
  };

  routineStep();
}
private spinPenguin(obj: THREE.Object3D, callback?: () => void) {
  const startRotation = obj.rotation.y;
  const targetRotation = startRotation + Math.PI * 2; // 360°
  const duration = 1; // 1 second spin
  let t = 0;

  const step = () => {
    t += 0.016;
    const progress = Math.min(t / duration, 1);
    obj.rotation.y = startRotation + (targetRotation - startRotation) * progress;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      if (callback) callback();
    }
  };

  step();
}



private happyJump(obj: THREE.Object3D, jumps: number, jumpHeight: number, callback?: () => void) {
  const startY = obj.position.y;
  let jumpIndex = 0;

  const doJump = () => {
    if (jumpIndex >= jumps) {
      if (callback) callback();
      return;
    }

    let t = 0;
    const duration = 0.6; // one small bounce
    const step = () => {
      t += 0.03;
      if (t > duration) {
        obj.position.y = startY;
        jumpIndex++;
        doJump();
        return;
      }

      obj.position.y = startY + Math.sin(Math.PI * (t / duration)) * jumpHeight;
      requestAnimationFrame(step);
    };
    step();
  };

  doJump();
}







private shakeChest(callback?: () => void, duration: number = 200) {
  const start = performance.now();
  const chest = this.chest;

  const shakeStep = (time: number) => {
    const t = time - start;
    if (t < duration) {
      const factor = Math.sin((t / duration) * Math.PI * 4) * 0.05;
      chest.rotation.y = Math.PI + factor;
      requestAnimationFrame(shakeStep);
    } else {
      chest.rotation.y = Math.PI;
      if (callback) callback();
    }
  };
  shakeStep(start);
}

private jumpObject(obj: THREE.Object3D, targetPos: THREE.Vector3, callback?: () => void) {
  const startPos = obj.position.clone();
  const jumpHeight = 3;
  const duration = 0.6;
  let t = 0;

  const step = () => {
    t += 0.02;
    if (t > duration) {
      obj.position.copy(targetPos);
      if (callback) callback();
      return;
    }

    obj.position.x = startPos.x + (targetPos.x - startPos.x) * (t / duration);
    obj.position.z = startPos.z + (targetPos.z - startPos.z) * (t / duration);

    obj.position.y = startPos.y + 4 * jumpHeight * t * (duration - t) / (duration * duration);

    requestAnimationFrame(step);
  };
  step();
}


private toScreenPosition(obj: THREE.Object3D) {
  const vector = new THREE.Vector3();
  obj.updateMatrixWorld();
  vector.setFromMatrixPosition(obj.matrixWorld);
  vector.project(this.camera);

  const container = this.canvasRef.nativeElement;
  const width = container.clientWidth;
  const height = container.clientHeight;

  return {
    x: (vector.x + 1) / 2 * width,
    y: (-vector.y + 1) / 2 * height
  };
}
goHome() {
  // Navigate to home page
  window.location.href = '/'; // or use Angular Router if preferred
}

}
