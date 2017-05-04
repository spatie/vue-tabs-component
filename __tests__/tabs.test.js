import { beforeEachHooks, afterEachHooks, mount } from 'vue-unit';

import Tabs from '../src/components/Tabs.vue';

describe('save-state', () => {

    beforeEach(() => {
        beforeEachHooks();
    });

    afterEach(() => {
        afterEachHooks();
    });

    it('can mount tabs', () => {
        mount(Tabs);
    });
});