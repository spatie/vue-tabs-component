let store = {};

const localStorageMock = (function () {

    return {
        getItem(key) {
            return store[key] || null;
        },

        setItem(key, value) {
            store[key] = value.toString();
        },

        clear() {
            store = {};
        },

        removeItem(key) {
            delete store[key];
        },
    };
});

export default localStorageMock;
