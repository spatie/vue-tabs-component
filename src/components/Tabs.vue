<template>
    <div>
        <div class="tabs">
            <ul>
                <li v-for="tab in tabs" :class="{ 'is-active': tab.isActive }">
                    <a :href="tab.realHref" @click="selectTab(tab)">{{ tab.name }}</a>
                </li>
            </ul>
        </div>
        <div class="tabs-details">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    import saveState from 'vue-save-state';
    import Tab from './Tab.vue';

    export default {
        components: {
            Tab
        },

/*
        mixins: [saveState],
*/

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
            const tabWithHash = this.findTab(window.location.hash);

            if (tabWithHash) {
                this.selectTab(tabWithHash);

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
            },

            findTab(href) {
                return this.tabs.find(tab => tab.realHref === href);
            },
        },
    };

</script>