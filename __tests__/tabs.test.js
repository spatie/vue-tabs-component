import Tab from '../src/components/Tab.vue';
import Tabs from '../src/components/Tabs.vue';
import Vue from 'vue/dist/vue.js';
import LocalStorageMock from './helpers/LocalStorageMock';

const localStorage = new LocalStorageMock();

window.localStorage = localStorage;

describe('vue-tabs', () => {
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

    it('remembers the tab that was opened previously', async () => {
        window.location.hash = '#third-tab';

        let { app, tabs } = await createVm();

        //expect(vm.activeTabHref).toEqual('#third-tab');

        window.location.hash = '';

        app.$destroy();

        vm = await createVm();

        expect(vm.activeTabHref).toEqual('#third-tab');
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