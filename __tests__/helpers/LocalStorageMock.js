let store = {};

const localStorage = (function () {

    return {
        getAll() {
            return store;
        },

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

export default localStorage;
