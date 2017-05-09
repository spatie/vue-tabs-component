import Tab from '../src/components/Tab.vue';
import Tabs from '../src/components/Tabs.vue';
import Vue from 'vue/dist/vue.js';
import LocalStorageMock from './helpers/LocalStorageMock';

const localStorage = new LocalStorageMock();

window.localStorage = localStorage;

describe('vue-tabs', () => {
    Vue.component('tabs', Tabs);
    Vue.component('tab', Tab);

    window.location.hash = '';

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

        Date = function(dateString) {
            return new dateClass(dateString || '2017-01-01T00:00:00.000Z');
        }
    });

    it('can mount tabs', async () => {
        await createVm();

        expect(document.body.innerHTML).toMatchSnapshot();
    });

    it('displays the first tab by default', async () => {
        const { tabs } = await createVm();

        expect(tabs.activeTabHref).toEqual('#first-tab');
    });

    it('uses the fragment of the url to determine which tab to open', async () => {
        window.location.hash = '#second-tab';

        const { tabs } = await createVm();

        expect(tabs.activeTabHref).toEqual('#second-tab');
    });

    it('will ignore the fragment if it does not match the href of a tab', async () => {
        window.location.hash = '#unknown-tab';

        const { tabs } = await createVm();

        expect(tabs.activeTabHref).toEqual('#first-tab');
    });

    it('writes the href of the last opened tab in local storage', async () => {
        window.location.hash = '#third-tab';

        let { tabs } = await createVm();

        expect(tabs.activeTabHref).toEqual('#third-tab');

        expect(localStorage.getAll()).toMatchSnapshot();
    });

    it('opens up the tabname found in local storage', async () => {
        localStorage.setItem('vue-tabs.cache.blank', JSON.stringify({
            href: "#third-tab",
            expires: subtractMinutes(new Date(), 1),
        }));

        let { tabs } = await createVm();

        expect(tabs.activeTabHref).toEqual('#third-tab');
    });

    it('will not use the tab in local storage after the default lifetime of 5 minutes', async () => {
        localStorage.setItem('vue-tabs.cache.blank', JSON.stringify({
            href: "#third-tab",
            expires: subtractMinutes(new Date(), 6),
        }));

        let { tabs } = await createVm();

        expect(tabs.activeTabHref).toEqual('#first-tab');
    });
});

async function createVm()
{
    const vm = new Vue({
        el: '#app',
    });

    await Vue.nextTick(() => {});

    return { app: vm, tabs: vm.$children[0] };
}

function subtractMinutes(date, minutes) {
    return new Date(date.getTime() - (minutes * 60000));
}