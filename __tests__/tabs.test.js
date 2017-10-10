import { Tab, Tabs } from '../src';
import Vue from 'vue/dist/vue.js';
import expiringStorage from '../src/expiringStorage';
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
        const tabs = await createVm();

        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('uses a custom fragment', async () => {
        document.body.innerHTML = `
            <div id="app">
                <tabs cache-lifetime="10">
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

        const tabs = await createVm();

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
        expiringStorage.set('vue-tabs-component.cache.blank', '#third-tab', 5);

        const tabs = await createVm();

        expect(tabs.activeTabHash).toEqual('#third-tab');
    });

    it('will not use the tab in storage if it has expired', async () => {
        expiringStorage.set('vue-tabs-component.cache.blank', '#third-tab', 5);

        progressTime(6);

        const tabs = await createVm();

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

    it('nested removes the tab hash', async () => {
        document.body.innerHTML = `
            <div id="app">
                <tabs nested>
                    <tab name="First tab" >
                        First tab content
                    </tab>
                </tabs>
            </div>
        `;

        await createVm();

        expect(document.body.innerHTML).toMatchSnapshot();
    });

    it('moves to the correct tab with wrapping false', async () => {
        const tabs = await createVm();

        // test nextTab/previousTab with wrapping false
        expect(tabs.activeTabHash).toEqual('#first-tab');
        tabs.nextTab();
        expect(tabs.activeTabHash).toEqual('#second-tab');
        tabs.nextTab();
        expect(tabs.activeTabHash).toEqual('#third-tab');
        tabs.nextTab();
        expect(tabs.activeTabHash).toEqual('#third-tab');
        tabs.previousTab();
        expect(tabs.activeTabHash).toEqual('#second-tab');
        tabs.previousTab();
        expect(tabs.activeTabHash).toEqual('#first-tab');
        tabs.previousTab();
        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('moves to the correct tab with wrapping true', async () => {
        const tabs = await createVm();

        // test nextTab/previousTab with wrapping true
        expect(tabs.activeTabHash).toEqual('#first-tab');
        tabs.nextTab(true);
        expect(tabs.activeTabHash).toEqual('#second-tab');
        tabs.nextTab(true);
        expect(tabs.activeTabHash).toEqual('#third-tab');
        tabs.nextTab(true);
        expect(tabs.activeTabHash).toEqual('#first-tab');

        tabs.previousTab(true);
        expect(tabs.activeTabHash).toEqual('#third-tab');
        tabs.previousTab(true);
        expect(tabs.activeTabHash).toEqual('#second-tab');
        tabs.previousTab(true);
        expect(tabs.activeTabHash).toEqual('#first-tab');
    });

    it('gets and sets tabs by index number', async () => {
        const tabs = await createVm();

        expect(tabs.getActiveTabIndex()).toEqual(0);
        tabs.selectTabByIndex(1);
        expect(tabs.activeTabHash).toEqual('#second-tab');
        expect(tabs.getActiveTabIndex()).toEqual(1);
        tabs.nextTab();
        expect(tabs.getActiveTabIndex()).toEqual(2);
    });
});

async function createVm() {
    const vm = new Vue({
        el: '#app',
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
