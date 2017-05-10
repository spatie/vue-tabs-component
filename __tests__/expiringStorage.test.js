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

    it('remembers values by key', async () => {
        expiringStorage.set('my-key', 'my-value', 5);

        expect(expiringStorage.get('my-key')).toEqual('my-value');
    });

    it('returns null if the value has expired ', async () => {
        expiringStorage.set('my-key', 'my-value', 5);

        progressTime(5);

        expect(expiringStorage.get('my-key')).toEqual('my-value');

        progressTime(1);

        expect(expiringStorage.get('my-key')).toBeNull();
    });

    it('returns null for unknown keys', async () => {
        expect(expiringStorage.get('unknown-key')).toBeNull();
    });
});

function progressTime(minutes) {
    const currentTime = (new Date()).getTime();

    const newTime = new Date(currentTime + (minutes * 60000));

    const dateClass = Date;

    // eslint-disable-next-line no-global-assign
    Date = function (dateString) {
        return new dateClass(dateString || newTime.toISOString());
    };
}