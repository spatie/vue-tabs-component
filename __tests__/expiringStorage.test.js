import { ExpiringStorage } from '../src/storages';
import LocalStorageMock from './helpers/LocalStorageMock';

const localStorage = new LocalStorageMock();

// noinspection JSAnnotator
window.localStorage = localStorage;

function newExperingStorage(options) {
    return new ExpiringStorage({
        prefix: '',
        cacheLifeTimeInMinutes: 5,
        ...options,
    });
}

describe('expiringStorage', () => {
    beforeEach(() => {
        localStorage.clear();

        const dateClass = Date;

        // eslint-disable-next-line no-global-assign
        Date = function (dateString) {
            return new dateClass(dateString || '2017-01-01T00:00:00.000Z');
        };
    });

    it('sets keys in the local storage', () => {
        const expiringStorage = newExperingStorage({ key: 'my-key' });
        expiringStorage.set('my-value');

        expect(localStorage.getAll()).toMatchSnapshot();
    });

    it('remembers values by key', () => {
        const expiringStorage = newExperingStorage({ key: 'my-key' });
        expiringStorage.set('my-value');

        expect(expiringStorage.get('my-key')).toEqual('my-value');
    });

    it('returns null if the value has expired ', () => {
        const expiringStorage = newExperingStorage({ key: 'my-key' });
        expiringStorage.set('my-value');

        progressTime(5);

        expect(expiringStorage.get('my-key')).toEqual('my-value');

        progressTime(1);

        expect(expiringStorage.get('my-key')).toBeNull();
    });

    it('returns null for unknown keys', () => {
        const expiringStorage = newExperingStorage({ key: 'my-key' });
        expect(expiringStorage.get('unknown-key')).toBeNull();
    });
});

function progressTime(minutes) {
    const currentTime = (new Date()).getTime();

    const newTime = new Date(currentTime + (minutes * 60000));

    const originalDateClass = Date;

    // eslint-disable-next-line no-global-assign
    Date = function (dateString) {
        return new originalDateClass(dateString || newTime.toISOString());
    };
}
