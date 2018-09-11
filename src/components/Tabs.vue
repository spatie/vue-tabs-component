<template>
    <div class="tabs-component">
        <ul role="tablist" class="tabs-component-tabs">
            <li v-for="tab in tabs"
                :class="{ 'is-active': tab.isActive }"
                class="tabs-component-tab"
                role="presentation"
                v-show="tab.isVisible"
            >
                <a v-html="tab.header"
                   :aria-controls="tab.hash"
                   :aria-selected="tab.isActive"
                   @click="selectTab(tab.hash, $event)"
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
            },
            options: {
                type: Object,
                required: false,
                default: () => ({
                    useUrlFragment: true
                }),
            },
        },

        data: () => ({
            tabs: [],
            activeTabHash: '',
        }),

        computed: {
            storageKey() {
                return `vue-tabs-component.cache.${window.location.host}${window.location.pathname}`;
            },

            activeTabIndex() {
                const tab = this.findTab(this.activeTabHash);
                return this.tabs.indexOf(tab);
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

            selectTab(selectedTabHash, event, setLocationHash) {
                // See if we should store the hash in the url fragment.
                if (event && !this.options.useUrlFragment) {
                  event.preventDefault();
                }

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

                this.selectTab(href, null, setLocationHash);
            },

            nextTab(cycle = false) {
                let index = this.activeTabIndex;
                index++;
                if (index === this.tabs.length) {
                    index = cycle ? 0 : index - 1;
                }
                this.selectTabByIndex(index, true);
            },

            previousTab(cycle = false) {
                let index = this.activeTabIndex;
                index--;
                if (index < 0) {
                    index = cycle ? this.tabs.length - 1 : index + 1;
                }
                this.selectTabByIndex(index, true);
            },
            
            setTabVisible(hash, visible) {
                const tab = this.findTab(hash);

                if (! tab) {
                    return;
                }

                tab.isVisible = visible;

                if (tab.isActive) {
                    // If tab is active, set a different one as active.
                    tab.isActive = visible;

                    this.tabs.every((tab, index, array) => {
                        if (tab.isVisible) {
                            tab.isActive = true;

                            return false;
                        }

                        return true;
                    });
                }
            },
        },
    };
</script>
