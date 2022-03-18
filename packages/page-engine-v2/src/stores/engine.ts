import { Context, createContext } from 'react';
import { BehaviorSubject } from 'rxjs';

function buildContextGetter(): <S extends PageEngineV2.BaseBlocksCommunicationState>(instanceId: string) => Context<BehaviorSubject<PageEngineV2.EngineState<S>>> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const contextMap: Record<string, Context<BehaviorSubject<PageEngineV2.EngineState<any>>>> = {};

  return <S extends PageEngineV2.BaseBlocksCommunicationState>(instanceId: string): Context<BehaviorSubject<PageEngineV2.EngineState<S>>> => {
    const context = contextMap[instanceId];
    if (context) {
      return context;
    }
    const Context = createContext<BehaviorSubject<PageEngineV2.EngineState<S>>>(create<S>({}));
    contextMap[instanceId] = Context;
    return Context;
  }
}

export function create<T extends PageEngineV2.BaseBlocksCommunicationState>(stateValue: PageEngineV2.EngineState<T>): BehaviorSubject<PageEngineV2.EngineState<T>> {
  return new BehaviorSubject<PageEngineV2.EngineState<T>>(stateValue);
}

export function update<T extends PageEngineV2.BaseBlocksCommunicationState>(store$: BehaviorSubject<PageEngineV2.EngineState<T>>, engineState: Partial<PageEngineV2.EngineState<T>>): void {
  store$.next({ ...store$.value, ...engineState });
}

export const getContext = buildContextGetter();