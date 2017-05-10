export default class LocalStorageMock {
    constructor() {
        this.store = {};
    }

    getAll() {
        return this.store;
    }

    getItem(key) {
        return this.store[key] || null;
    }

    setItem(key, value) {
        this.store[key] = value.toString();
    }

    clear() {
        this.store = {};
    }

    removeItem(key) {
        delete this.store[key];
    }
}
