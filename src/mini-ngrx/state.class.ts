/**
 * @copyright ngrx
 */
import { BehaviorSubject, Observable, queueScheduler } from 'rxjs';
import { observeOn, scan } from 'rxjs/operators';
import { Action, ActionReducer } from './index';

export class MiniState<T> extends BehaviorSubject<T> {
  constructor(
    _initialState: T,
    actionsDispatcher$: Observable<Action>,
    reducer: ActionReducer<T>
  ) {
    super(_initialState);

    const actionInQueue$ = observeOn.call(actionsDispatcher$, queueScheduler);
    const state$ = scan.call(
      actionInQueue$,
      (state: T, action: Action) => {
        if (!action) {
          return state;
        }

        return reducer(state, action);
      },
      _initialState
    );

    state$.subscribe((value: T) => this.next(value));
  }
}
