<template>
    <div v-show="isActive">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            selected: { default: false },
            href: { default: false },
        },

        computed: {
            header() {
                return this.name;
            },
        },

        data() {
            return {
                isActive: false,
                realHref: false,
            };
        },

        created() {
            this.realHref = this.href
                ? '#'+this.href
                : '#' + this.name.toLowerCase().replace(/ /g, '-');
        },

        mounted() {
            this.isActive = this.selected;
        },
    };
</script>