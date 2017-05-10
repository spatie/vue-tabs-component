class ExpiringStorage {

    get(key) {
        let cache = localStorage.getItem(key);

        if (!cache) {
            return;
        }

        cache = JSON.parse(cache);

        const expiryDate = new Date(cache.expires);

        if (expiryDate < new Date()) {
            return null;
        }

        return cache.value;
    }

    set(key, value, lifeTime) {
        const currentTime = new Date().getTime();

        const expires = new Date(currentTime + lifeTime * 60000);

        const cache = { value, expires };

        localStorage.setItem(key, JSON.stringify(cache));
    }
}

export default new ExpiringStorage();
