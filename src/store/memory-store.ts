import type { Store } from "./store";

export class MemoryStore<T> implements Store<T> {
  private store = new Map<string, T>();

  get(key: string) {
    return this.store.get(key);
  }

  set(key: string, value: T) {
    this.store.set(key, value);
  }
}
