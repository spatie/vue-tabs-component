import Tab from './components/Tab';
import Tabs from './components/Tabs';

export default {
    install(Vue) {
        Vue.component('tab', Tab);
        Vue.component('tabs', Tabs);
    },
};

export { Tab, Tabs };
