type Listener = (event: String, info: unknown) => unknown;

class EventBus {
  public listenerMap: Map<string, Listener[]>;
  constructor() {
    this.listenerMap = new Map();
  }

  on(event: string, fn: Listener) {
    const { listenerMap } = this;
    if (!listenerMap.has(event)) {
      listenerMap.set(event, []);
    }

    listenerMap.get(event).push(fn);
  }

  emit(event: string, info?: unknown) {
    const { listenerMap } = this;
    if (!listenerMap.has(event)) {
      return;
    }

    const listeners = listenerMap.get(event);
    listeners.forEach(listener => listener(event, info));
  }

  off(event: string) {
    const { listenerMap } = this;
    if (listenerMap.has(event)) {
      listenerMap.delete(event);
    }
  }
}
