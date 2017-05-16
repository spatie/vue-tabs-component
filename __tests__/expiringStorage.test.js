import expiringStorage from '../src/expiringStorage';
import LocalStorageMock from './helpers/LocalStorageMock';

const localStorage = new LocalStorageMock();

window.localStorage = localStorage;

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
        expiringStorage.set('my-key', 'my-value', 5);

        expect(localStorage.getAll()).toMatchSnapshot();
    });

    it('remembers values by key', () => {
        expiringStorage.set('my-key', 'my-value', 5);

        expect(expiringStorage.get('my-key')).toEqual('my-value');
    });

    it('returns null if the value has expired ', () => {
        expiringStorage.set('my-key', 'my-value', 5);

        progressTime(5);

        expect(expiringStorage.get('my-key')).toEqual('my-value');

        progressTime(1);

        expect(expiringStorage.get('my-key')).toBeNull();
    });

    it('returns null for unknown keys', () => {
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