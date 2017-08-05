<template>
    <div class="tabs-component">
        <ul role="tablist" class="tabs-component-tabs">
            <li v-for="tab in tabs"
                :class="{ 'is-active': tab.isActive }"
                class="tabs-component-tab"
                role="presentation"
            >

                <a v-html="tab.header"
                   :aria-controls="tab.hash"
                   :aria-selected="tab.isActive"
                   @click="selectTab(tab.hash)"
                   :href="nested ? null : tab.hash"
                   class="tabs-component-tab-a"
                   role="tab"
                ></a>

            </li>
        </ul>
        <div class="tabs-component-panels">
            <slot/>
        </div>
    </div>
</template>

<script>
    import expiringStorage from '../expiringStorage';

    export default {
        props: {
            cacheLifetime: { default: 5 },
            nested: {
                type: Boolean,
                default: false,
            }
        },

        data: () => ({
            tabs: [],
            activeTabHash: '',
        }),

        computed: {
            storageKey() {
                return `vue-tabs-component.cache.${window.location.host}${window.location.pathname}`;
            },
        },

        created() {
            this.tabs = this.$children;
        },

        mounted() {
            window.addEventListener('hashchange', () => this.selectTab(window.location.hash));

            if (this.findTab(window.location.hash)) {
                this.selectTab(window.location.hash);
                return;
            }

            const previousSelectedTabHash = expiringStorage.get(this.storageKey);

            if (this.findTab(previousSelectedTabHash)) {
                this.selectTab(previousSelectedTabHash);
                return;
            }

            if (this.tabs.length) {
                this.selectTab(this.tabs[0].hash);
            }
        },

        methods: {
            findTab(hash) {
                return this.tabs.find(tab => tab.hash === hash);
            },

            selectTab(selectedTabHash, setLocationHash) {
                const selectedTab = this.findTab(selectedTabHash);

                if (! selectedTab) {
                    return;
                }

                this.tabs.forEach(tab => {
                    tab.isActive = (tab.hash === selectedTab.hash);
                });

                this.$emit('changed', { tab: selectedTab });

                this.activeTabHash = selectedTab.hash;
                if (setLocationHash) {
                    window.location.hash = selectedTab.hash;
                }

                expiringStorage.set(this.storageKey, selectedTab.hash, this.cacheLifetime);
            },

            selectTabByIndex(index, setLocationHash) {
                const tab = this.tabs[index];
                const href = tab.hash;

                this.selectTab(href, setLocationHash);
            },

            getActiveTabIndex() {
                const tab = this.findTab(this.activeTabHash);
                return this.tabs.indexOf(tab);
            },

            nextTab(wrap = false) {
                let index = this.getActiveTabIndex();
                index++;
                if (index === this.tabs.length) {
                    index = wrap ? 0 : index - 1;
                }
                this.selectTabByIndex(index, true);
            },

            previousTab(wrap = false) {
                let index = this.getActiveTabIndex();
                index--;
                if (index < 0) {
                    index = wrap ? this.tabs.length - 1 : index + 1;
                }
                this.selectTabByIndex(index, true);
            },
        },
    };
</script>
