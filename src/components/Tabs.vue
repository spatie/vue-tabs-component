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
    import Tab from './Tab.vue';

    export default {
        components: {
            Tab
        },

        data() {
            return {
                tabs: []
            };
        },

        created() {
            this.tabs = this.$children;
        },

        mounted() {
            if (this.tabs.length) {
                this.selectTab(this.tabs[0]);
            }
        },

        methods: {
            selectTab(selectedTab) {
                this.tabs.forEach(tab => {
                    tab.isActive = (tab.realHref === selectedTab.realHref);
                });
            }
        },
    };
</script>