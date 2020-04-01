interface internal {
	addListener(event: string | symbol, listener: (...args: any[]) => void): this;
	on(event: string | symbol, listener: (...args: any[]) => void): this;
	once(event: string | symbol, listener: (...args: any[]) => void): this;
	prependListener(event: string | symbol, listener: (...args: any[]) => void): this;
	prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this;
	removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
	off(event: string | symbol, listener: (...args: any[]) => void): this;
	removeAllListeners(event?: string | symbol): this;
	setMaxListeners(n: number): this;
	getMaxListeners(): number;
	listeners(event: string | symbol): Function[];
	rawListeners(event: string | symbol): Function[];
	emit(event: string | symbol, ...args: any[]): boolean;
	eventNames(): Array<string | symbol>;
	listenerCount(type: string | symbol): number;
}

type eventSymbol = string | symbol;
type listenerFunc = (...args: any[]) => void;

class Events implements internal {
	static defaultMaxListeners = 20;
	private maxListener: number = 10;
	private eventMap: Map<eventSymbol, Array<listenerFunc>>;
	constructor() {
		this.eventMap = new Map();
	}

	addListener(event: eventSymbol, listener: listenerFunc): this {
		if (!this.eventMap.has(event)) {
			this.eventMap.set(event, []);
		}
		let listeners = this.eventMap.get(event);
		listeners.push(listener);
		return this;
	}

	on(event: eventSymbol, listener: listenerFunc): this {
		return this.addListener(event, listener);
	}

	once(event: eventSymbol, listener: listenerFunc): this {
		const listenerWrap = (...args) => {
			listener(...args);
		};
		return this.addListener(event, listener);
	}

	prependListener(event: eventSymbol, listener: listenerFunc): this {
		if (!this.eventMap.has(event)) {
			this.eventMap.set(event, []);
		}
		this.eventMap.get(event).unshift(listener);
		return this;
	}

	removeListener(event: eventSymbol, listener: listenerFunc): this {
		if (!this.eventMap.has(event)) {
			return;
		}
		const listeners = this.eventMap.get(event);
		const index = listeners.indexOf(listener);
		if (index !== -1) {
			listeners.splice(index, 1);
		}
	}

	off(event: eventSymbol, listener: listenerFunc) {
		return this.removeListener(event, listener);
	}

	removeAllListeners(event: eventSymbol) {
		this.eventMap.delete(event);
		return this;
	}

	setMaxListeners(n: number): this {
		this.maxListener = 10;
		return;
	}

	getMaxListeners(): number {
		return this.maxListener;
	}

	listeners(event: eventSymbol): Function[] {
		return this.eventMap.get(event) || [];
	}

	rawListeners(event: eventSymbol): Function[] {
		return this.eventMap.get(event) || [];
	}

	emit(event: string | symbol, ...args: any[]): boolean {
		if (this.eventMap.has(event)) {
			this.eventMap.get(event).forEach((cb) => cb(...args));
			return this.eventMap.get(event).length !== 0;
		}
		return false;
	}

	eventNames(): Array<eventSymbol> {
		let events: Array<eventSymbol> = [];
		this.eventMap.forEach((value, key) => events.push(key));
		return events;
	}

	listenerCount(event: eventSymbol): number {
		const listeners = this.eventMap.get(event);
		return listeners.length;
	}
}
