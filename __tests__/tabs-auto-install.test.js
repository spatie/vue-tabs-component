import Vue from 'vue';
import '../src/auto';

describe('vue-tabs-component', () => {

    it('can be auto installed', () => {
        expect(Vue.component('tab')).toBeDefined();
        expect(Vue.component('tabs')).toBeDefined();
    });

});
