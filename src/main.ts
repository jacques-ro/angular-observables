import 'zone.js/dist/zone';
import { Component, computed, effect, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { bootstrapApplication } from '@angular/platform-browser';
import { map, shareReplay, timer } from 'rxjs';
import { TestComponent } from './components/observables/observables.component';

@Component({
  selector: 'my-app',
  standalone: true,
  imports: [CommonModule, TestComponent],
  template: `
    <app-test />
  `,
})
export class App {}

bootstrapApplication(App);
