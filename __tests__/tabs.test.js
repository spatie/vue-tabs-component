import Tab from '../src/components/Tab.vue';
import Tabs from '../src/components/Tabs.vue';
import Vue from 'vue/dist/vue.js';
import LocalStorageMock from './helpers/LocalStorageMock';

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

        const localStorage = new LocalStorageMock();

        window.localStorage = localStorage;

    });

    it('can mount tabs', async () => {
        createVm();

        await Vue.nextTick(() => {});

        expect(document.body.innerHTML).toMatchSnapshot();
    });

    it('displays the first tab by default', async () => {
        const vm = createVm();

        await Vue.nextTick(() => {});

        const tabs = vm.$children[0];

        expect(tabs.activeTabHref).toEqual('#first-tab');
    });
});

function createVm()
{
    return new Vue({
        el: '#app',
    });
}