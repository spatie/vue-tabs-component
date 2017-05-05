import Tab from '../src/components/Tab.vue';
import Tabs from '../src/components/Tabs.vue';
import Vue from 'vue/dist/vue.js';

describe('save-state', () => {
    Vue.component('tabs', Tabs);
    Vue.component('tab', Tab);

    beforeEach(() => {
        document.body.innerHTML = `
            <div id="app">
                <tabs>
                    <tab name="Foo">
                        Hello
                    </tab>
                </tabs>
            </div>
        `;
    });

    it('can mount tabs', () => {
        const vm = new Vue({
            el: '#app',
        });

        expect(document.body.innerHTML).toMatchSnapshot();
    });
});