<template>
    <div class="tabs-component">
        <ul role="tablist" class="tabs-component-tabs">
            <li v-for="tab in tabs"
                :aria-selected="tab.isActive"
                :class="{ 'is-active': tab.isActive }"
                class="tabsComponent-tab"
                role="presentation tab"
                :tabindex="tab.isActive ? 0 : -1"
            >

                <a v-html="tab.header"
                   :aria-controls="tab.hash"
                   @click="selectTab(tab)"
                   :href="tab.hash"
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
            const tabWithHash = this.findTab(window.location.hash);

            if (tabWithHash) {
                this.selectTab(tabWithHash);
                return;
            }

            const previousSelectedTab = this.findTab(expiringStorage.get(this.storageKey));

            if (previousSelectedTab) {
                this.selectTab(previousSelectedTab);
                return;
            }

            if (this.tabs.length) {
                this.selectTab(this.tabs[0]);
            }
        },

        methods: {
            findTab(hash) {
                return this.tabs.find(tab => tab.hash === hash);
            },

            selectTab(selectedTab) {
                this.tabs.forEach(tab => {
                    tab.isActive = (tab.hash === selectedTab.hash);
                });

                this.$emit('changed', { tab: selectedTab });

                this.activeTabHash = selectedTab.hash;

                expiringStorage.set(this.storageKey, selectedTab.hash, this.cacheLifetime);
            },
        },
    };
</script>
