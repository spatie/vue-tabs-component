export function on(target, event, callback, capture = false) {
    target.addEventListener(event, callback, capture);
    return { destroy: () => {
        target.removeEventListener(event, callback, capture);
    } };
}

export class ExpiringStorage {
    constructor(options) {
        this.options = options;
    }

    createKey() {
        const prefix = typeof this.options.prefix === 'string'
            ? this.options.prefix
            : 'vue-tabs-component.cache.';
        return `${prefix}${this.options.key}`;
    }

    get() {
        const key = this.createKey();
        const cached = JSON.parse(
            localStorage.getItem(key)
        );

        if (! cached) {
            return null;
        }

        const expires = new Date(cached.expires);

        if (expires < new Date()) {
            localStorage.removeItem(key);
            return null;
        }

        return cached.value;
    }

    set(value) {
        const key = this.createKey();
        const currentTime = new Date().getTime();
        const expires = new Date(currentTime + this.options.cacheLifeTimeInMinutes * 60000);

        localStorage.setItem(key, JSON.stringify({ value, expires }));
    }
}

export class HashStorage {
    constructor(options) {
        this.options = options;
        this.unmount = HashStorage.mount(this);
    }

    get() {
        return window.location.hash ? window.location.hash : null;
    }

    set(value) {
        if (this.options.useUrlFragment && value !== this.get()) {
            window.location.hash = value;
        }
    }

    destroy() {
        this.unmount();
    }

    static dispatchChange() {
        for (const instance of this.instances) {
            instance.options.autoSelectTab();
        }
    }

    static mount(instance) {
        if (typeof this.instances === 'undefined') {
            this.instances = [];
        }

        if (typeof this.listener === 'undefined') {
            this.listener = on(window, 'hashchange', this.dispatchChange.bind(HashStorage));
        }

        this.instances.push(instance);
        return () => {
            const index = this.instances.indexOf(instance);

            if (index > -1) {
                this.instances.splice(index, 1);
            }

            if (this.instances.length === 0) {
                this.listener.destroy();
                delete this.listener;
            }
        };
    }
}

export class ChainStorage {
    constructor(options) {
        this.options = options;
    }

    get() {
        for (const backend of this.options.backends) {
            const value = backend.get();

            if (value !== null) {
                return value;
            }
        }

        return null;
    }

    set(value) {
        const continueOnSuccess = this.options.continueOnSuccess || true;
        let result = true;

        for (const backend of this.options.backends) {
            const wasSuccessful = backend.set(value) !== false;
            result &= wasSuccessful;

            if (wasSuccessful && !continueOnSuccess) {
                return result;
            }
        }

        return result;
    }

    destroy() {
        for (const backend of this.options.backends) {
            backend.destroy();
        }
    }
}

export default {
    ExpiringStorage,
    HashStorage,
    ChainStorage,
};
