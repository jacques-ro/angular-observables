import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  Observable,
  of,
  share,
  shareReplay,
  Subscriber,
  Subscription,
  tap,
} from 'rxjs';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule],
  templateUrl: 'observables.component.html',
})
export class TestComponent {
  public readonly subscribedToObservable$: Observable<string>;
  public readonly notSubscribedToObservable$: Observable<string>;
  public readonly twiceSubscribedToObservable$: Observable<string>;

  public readonly notSharedObservable$: Observable<string>;
  public readonly sharedObservable$: Observable<string>;

  public readonly subscriberInClassObservable$: Observable<string>;

  private readonly _subscriptions = new Subscription();

  private _subscriberInClass: Subscriber<any>;

  constructor() {
    // the template subscribes to this, so the tap logs to console and the value appears in the template
    this.subscribedToObservable$ = of('Hello from subscribedToObservable').pipe(
      tap((v) => console.log(v))
    );

    // the template does not subscribe to this, so the observable does not emit
    this.notSubscribedToObservable$ = of(
      'Hello from notSubscribedToObservable'
    ).pipe(tap((v) => console.log(v)));

    // the template subscribes to this and there is a subscription in the component so the tap logs to console twice and the value appears in the template
    this.twiceSubscribedToObservable$ = of(
      'Hello from twiceSubscribedToObservable'
    ).pipe(
      tap((v) => console.log(v)) // this will log twice as there are two active subscriptions
    );

    this._subscriptions.add(
      this.twiceSubscribedToObservable$.subscribe((_) => {})
    );

    this.notSharedObservable$ = new Observable((subscriber) => {
      // this is the producer of the observable
      // when something subscribes to it, it will become active
      //
      // to demonstrate 'unicast' vs 'multicast', there is another observable which is shared

      console.log(
        'I am the producer of notSharedObservable. You will see this message for each subscriber that is created, as the producer-consumer relation is 1:1'
      );

      subscriber.next('Hello from notSharedObservable');
    });

    this.sharedObservable$ = new Observable<string>((subscriber) => {
      // this is the producer of the observable
      // when something subscribes to it, it will become active
      //
      // to demonstrate 'unicast' vs 'multicast', this observable will be shared using the share operator

      console.log(
        'I am the producer of sharedObservable. You will only see this once in the console, no matter how many subscribers are there.'
      );

      subscriber.next('Hello from sharedObservable');
    }).pipe(shareReplay(1));

    this._subscriptions.add(this.sharedObservable$.subscribe((_) => {}));
    this._subscriptions.add(this.notSharedObservable$.subscribe((_) => {}));

    this.subscriberInClassObservable$ = new Observable<any>(
      (subscriberInClass) => {
        this._subscriberInClass = subscriberInClass;
      }
    );

    // this will cause an exception
    try {
      this._subscriberInClass.next('Hello from subscriberInClassObservable');
    } catch (ex) {
      console.log('EXCEPTION: ' + ex);
    }

    this._subscriptions.add(
      this.subscriberInClassObservable$.subscribe((v) => {
        console.log('first subscription: ' + v);
      })
    );

    // this will not cause an exception, but...
    try {
      this._subscriberInClass.next('Hello from subscriberInClassObservable');
    } catch (ex) {
      console.log('EXCEPTION: ' + ex);
    }

    // ... this will create another producer and thus our class field '_subscriberInClass' is overridden and we lose
    // the reference to the subscriber of the first producer, essentially rendering our first subscription useless
    this._subscriptions.add(
      this.subscriberInClassObservable$.subscribe((v) => {
        console.log('second subscription: ' + v);
      })
    );

    // this will only reach second subscription, as each producer has their own subscriber...
    try {
      this._subscriberInClass.next('Hello from subscriberInClassObservable');
    } catch (ex) {
      console.log('EXCEPTION: ' + ex);
    }
  }
}
