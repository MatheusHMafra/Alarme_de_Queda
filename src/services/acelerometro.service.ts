import { Injectable } from '@angular/core';
import { DeviceMotion, DeviceMotionAccelerationData } from '@ionic-native/device-motion/ngx';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AcelerometroService {
  private accelerationSubject = new Subject<DeviceMotionAccelerationData>();
  private watch: any;

  constructor(private deviceMotion: DeviceMotion) {}

  startMonitoring(sensitivity: number) {
    this.watch = this.deviceMotion.watchAcceleration({ frequency: 100 }).subscribe((acceleration: DeviceMotionAccelerationData) => {
      if (this.isFallDetected(acceleration, sensitivity)) {
        this.accelerationSubject.next(acceleration);
      }
    });
  }

  stopMonitoring() {
    if (this.watch) {
      this.watch.unsubscribe();
    }
  }

  getAccelerationUpdates() {
    return this.accelerationSubject.asObservable();
  }

  private isFallDetected(acceleration: DeviceMotionAccelerationData, sensitivity: number): boolean {
    const totalAcceleration = Math.sqrt(acceleration.x * acceleration.x + acceleration.y * acceleration.y + acceleration.z * acceleration.z);
    return totalAcceleration < sensitivity;
  }
}