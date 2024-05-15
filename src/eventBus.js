// eventBus.js
import { provide, inject } from 'vue';

const EventBusSymbol = Symbol();

export function provideEventBus() {
  const eventBus = mitt();

  provide(EventBusSymbol, eventBus);
}

export function useEventBus() {
  const eventBus = inject(EventBusSymbol);
  if (!eventBus) {
    throw new Error('EventBus not provided');
  }
  return eventBus;
}
