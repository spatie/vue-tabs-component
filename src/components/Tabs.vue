<template>
    <div>
        <div class="tabs">
            <ul>
                <li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
                    <a :href="tab.realHref" @click="selectTab(tab)">
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
            Tab
        },

        props: {
            cacheLifetime: { default: 5 },
        },

        data() {
            return {
                tabs: [],
                activeTabHref: '',
            };
        },

        created() {
            this.tabs = this.$children;
        },

        mounted() {
            if (const tabWithHash = this.findTab(window.location.hash)) {
                this.selectTab(tabWithHash);
                return;
            }

           if (const previousSelectedTab = this.retrieveSelectedTab()) {
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
                    tab.isActive = (tab.realHref === selectedTab.realHref);
                });

                this.$emit('changed', { tab: selectedTab });

                this.activeTabHref = selectedTab.realHref;

                this.rememberSelectedTab(selectedTab);
            },

            findTab(href) {
                return this.tabs.find(tab => tab.realHref === href);
            },

            rememberSelectedTab(tab) {
                const cache = {href: tab.realHref, expires: this.addMinutes(new Date(), this.cacheLifetime)}

                localStorage.setItem(this.determineLocalStorageKey(), JSON.stringify(cache));
            },

            retrieveSelectedTab() {
                let cache = localStorage.getItem(this.determineLocalStorageKey());

                if (! cache) {
                    return;
                }

                cache = JSON.parse(cache);

                const dateString = cache.expires;

                return this.findTab(cache.href);
            },

            determineLocalStorageKey() {
                return `vue-tabs.cache.${window.location.host}${window.location.pathname}`;
            },

            addMinutes(date, minutes) {
                return new Date(date.getTime() + minutes * 60000);
            },
        },
    };
</script>