<template>
    <div>
        <div class="tabs">
            <ul>
                <li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
                    <a :href="tab.hash" @click="selectTab(tab)">
                        <div v-html="tab.header"></div>
                    </a>
                </li>
            </ul>
        </div>
        <div class="tabs-details">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import Tab from './Tab.vue';

    export default {
        components: {
            Tab,
        },

        props: {
            cacheLifetime: { default: 5 },
        },

        data() {
            return {
                tabs: [],
                activeTabHash: '',
            };
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

            const previousSelectedTab = this.retrieveSelectedTab();

            if (previousSelectedTab) {
                this.selectTab(previousSelectedTab);
                return;
            }

            if (this.tabs.length) {
                this.selectTab(this.tabs[0]);
            }
        },

        methods: {
            selectTab(selectedTab) {
                this.tabs.forEach(tab => {
                    tab.isActive = (tab.hash === selectedTab.hash);
                });

                this.$emit('changed', { tab: selectedTab });

                this.activeTabHash = selectedTab.hash;

                this.rememberSelectedTab(selectedTab);
            },

            findTab(hash) {
                return this.tabs.find(tab => tab.hash === hash);
            },

            rememberSelectedTab(tab) {
                const cache = { hash: tab.hash, expires: this.addMinutes(new Date(), this.cacheLifetime) };

                localStorage.setItem(this.determineLocalStorageKey(), JSON.stringify(cache));
            },

            retrieveSelectedTab() {
                let cache = localStorage.getItem(this.determineLocalStorageKey());

                if (!cache) {
                    return;
                }

                cache = JSON.parse(cache);

                const expiryDate = new Date(cache.expires);

                if (expiryDate < new Date()) {
                    return;
                }

                return this.findTab(cache.hash);
            },

            determineLocalStorageKey() {
                return `vue-tabs-component.cache.${window.location.host}${window.location.pathname}`;
            },

            addMinutes(date, minutes) {
                return new Date(date.getTime() + minutes * 60000);
            },
        },
    };
</script>
