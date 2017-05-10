import { Tab, Tabs } from '../src';
import Vue from 'vue/dist/vue.js';
import LocalStorageMock from './helpers/LocalStorageMock';

const localStorage = new LocalStorageMock();

window.localStorage = localStorage;

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
        const { tabs } = await createVm();

        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('uses the fragment of the url to determine which tab to open', async () => {
        window.location.hash = '#second-tab';

        const { tabs } = await createVm();

        expect(tabs.activeTabHash).toEqual('#second-tab');
    });

    it('will ignore the fragment if it does not match the hash of a tab', async () => {
        window.location.hash = '#unknown-tab';

        const { tabs } = await createVm();

        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('writes the hash of the last opened tab in local storage', async () => {
        window.location.hash = '#third-tab';

        const { tabs } = await createVm();

        expect(tabs.activeTabHash).toEqual('#third-tab');

        expect(localStorage.getAll()).toMatchSnapshot();
    });

    it('opens up the tabname found in local storage', async () => {
        localStorage.setItem('vue-tabs-component.cache.blank', JSON.stringify({
            value: '#third-tab',
            expires: new Date(),
        }));

        const { tabs } = await createVm();

        expect(tabs.activeTabHash).toEqual('#third-tab');
    });

    it('will not use the tab in local storage if it has expired', async () => {
        localStorage.setItem('vue-tabs-component.cache.blank', JSON.stringify({
            hash: '#third-tab',
            expires: subtractMinutes(new Date(), 1),
        }));

        const { tabs } = await createVm();

        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('the life time of the cache can be set', async () => {
        document.body.innerHTML = `
            <div id="app">
                <tabs cache-lifetime="10">
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
                <tabs cache-lifetime="10">
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

async function createVm() {
    const vm = new Vue({
        el: '#app',
    });

    await Vue.nextTick(() => {});

    return { app: vm, tabs: vm.$children[0] };
}

function subtractMinutes(date, minutes) {
    return new Date(date.getTime() - (minutes * 60000));
}
