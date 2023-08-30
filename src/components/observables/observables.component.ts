import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Observable, of, tap } from 'rxjs';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'observables.component.html',
})
export class TestComponent {
  public readonly subscribedToObservable$: Observable<string>;
  public readonly notSubscribedToObservable$: Observable<string>;

  constructor() {
    this.subscribedToObservable$ = of('Hello from subscribedToObservable').pipe(
      tap((v) => console.log(v))
    );
    this.notSubscribedToObservable$ = of(
      'Hello from notSubscribedToObservable'
    ).pipe(tap((v) => console.log(v)));
  }
}
