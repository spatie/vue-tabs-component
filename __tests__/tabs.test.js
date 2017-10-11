import { Tab, Tabs } from '../src';
import Vue from 'vue/dist/vue.js';
import { ExpiringStorage } from '../src/storages';
import LocalStorageMock from './helpers/LocalStorageMock';

const localStorage = new LocalStorageMock();

// noinspection JSAnnotator
window.localStorage = localStorage;

function newExpiringStorage(options) {
    const newOptions = { ...options, key: 'blank' };
    return new ExpiringStorage(newOptions);
}

describe('vue-tabs-component', () => {
    Vue.component('tabs', Tabs);
    Vue.component('tab', Tab);

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="app">
                <tabs>
                    <tab name="First tab">
                        First tab content
                    </tab>
                    <tab name="Second tab">
                        Second tab content
                    </tab>
                    <tab name="Third tab">
                        Third tab content
                    </tab>
                </tabs>
            </div>
        `;

        localStorage.clear();

        const dateClass = Date;

        // eslint-disable-next-line no-global-assign
        Date = function (dateString) {
            return new dateClass(dateString || '2017-01-01T00:00:00.000Z');
        };

        window.location.hash = '';
    });

    it('can mount tabs', async () => {
        await createVm();

        expect(document.body.innerHTML).toMatchSnapshot();
    });

    it('displays the first tab by default', async () => {
        const tabs = await createVm();

        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('uses a custom fragment', async () => {
        document.body.innerHTML = `
            <div id="app">
                <tabs :storage-options="{ cacheLifeTimeInMinutes: 10 }">
                    <tab id="my-fragment" name="First tab" >
                        First tab content
                    </tab>
                </tabs>
            </div>
        `;

        const tabs = await createVm();

        expect(tabs.activeTabHash).toEqual('#my-fragment');
    });

    it('uses the fragment of the url to determine which tab to open', async () => {
        window.location.hash = '#second-tab';
        await createVm();

        expect(document.body.innerHTML).toMatchSnapshot();
    });

    it('ignores the fragment if it does not match the hash of a tab', async () => {
        window.location.hash = '#unknown-tab';

        const tabs = await createVm();

        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('writes the hash of the last opened tab in local storage', async () => {
        window.location.hash = '#third-tab';

        const tabs = await createVm();

        expect(tabs.activeTabHash).toEqual('#third-tab');

        expect(localStorage.getAll()).toMatchSnapshot();
    });

    it('opens up the tabname found in storage', async () => {
        const storage = newExpiringStorage();
        storage.set('#third-tab');
        const tabs = await createVm({
            props: {
                storage: () => storage,
            },
        });

        expect(tabs.activeTabHash).toEqual('#third-tab');
    });

    it('will not use the tab in storage if it has expired', async () => {
        const storage = newExpiringStorage();
        storage.set('#third-tab');
        progressTime(6);

        const tabs = await createVm({
            props: {
                storage: () => storage,
            },
        });

        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('the life time of the cache can be set', async () => {
        document.body.innerHTML = `
            <div id="app">
                <tabs :storage-options="{ cacheLifeTimeInMinutes: 10 }">
                    <tab name="First tab">
                        First tab content
                    </tab>
                </tabs>
            </div>
        `;

        await createVm();

        expect(localStorage.getAll()).toMatchSnapshot();
    });

    it('can accept a prefix and a suffix for the name', async () => {
        document.body.innerHTML = `
            <div id="app">
                <tabs :storage-options="{ cacheLifeTimeInMinutes: 10 }">
                    <tab name="First tab" prefix="prefix" suffix="suffix">
                        First tab content
                    </tab>
                </tabs>
            </div>
        `;

        await createVm();

        expect(document.body.innerHTML).toMatchSnapshot();
    });
});

async function createVm(options = {}) {
    const vm = new Vue({
        el: '#app',
        ...options,
    });

    await Vue.nextTick();

    return vm.$children[0];
}

function progressTime(minutes) {
    const currentTime = (new Date()).getTime();

    const newTime = new Date(currentTime + (minutes * 60000));

    const originalDateClass = Date;

    // eslint-disable-next-line no-global-assign
    Date = function (dateString) {
        return new originalDateClass(dateString || newTime.toISOString());
    };
}
