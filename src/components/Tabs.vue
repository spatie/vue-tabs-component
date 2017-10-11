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
                   @click="selectTab(tab.hash)"
                   :href="tab.hash"
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
    import { ExpiringStorage, HashStorage, ChainStorage } from '../storages';

    function createDefaultStorage(options) {
        const expiringStorage = new ExpiringStorage(options);
        const hashStorage = new HashStorage(options);
        return new ChainStorage({
            backends: [hashStorage, expiringStorage],
            ...options,
        });
    }

    export default {
        props: {
            id: {
                type: String,
                required: false,
            },
            storage: {
                type: Function,
                required: false,
                default: createDefaultStorage,
            },
            storageOptions: {
                type: Object,
                required: false,
                default: () => ({
                    useUrlFragment: true,
                    cacheLifeTimeInMinutes: 5,
                }),
            },
        },

        data: () => ({
            tabs: [],
            activeTabHash: null,
        }),

        computed: {
            _storage() {
                const options = {
                    key: this.id || `${window.location.host}${window.location.pathname}`,
                    ...this.storageOptions,
                    autoSelectTab: this.selectTabFromStorage,
                };
                return this.storage(options);
            },
        },

        methods: {
            findTab(hash) {
                return this.tabs.find(tab => tab.hash === hash);
            },

            selectTabFromStorage() {
                const newTab = this._storage.get();

                if (this.findTab(newTab)) {
                    this.selectTab(newTab);
                } else if (this.tabs.length) {
                    this.selectTab(this.tabs[0].hash);
                }
            },

            selectTab(selectedTabHash) {
                const selectedTab = this.findTab(selectedTabHash);

                if (! selectedTab) {
                    return;
                }

                if (this._storage.set(selectedTab.hash) !== false) {
                    this.tabs.forEach(tab => {
                        tab.isActive = (tab.hash === selectedTab.hash);
                    });
                    this.activeTabHash = selectedTab.hash;
                    this.$emit('changed', { tab: selectedTab });
                }
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

        created() {
            this.tabs = this.$children;
        },

        mounted() {
            this.selectTabFromStorage();
        },

        beforeDestroy() {
            if (typeof this._storage.destroy !== 'undefined') {
                this._storage.destroy();
            }
        },
    };
</script>
