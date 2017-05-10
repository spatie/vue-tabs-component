<template>
    <div v-show="isActive">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            prefix: { default: '' },
            suffix: { default: '' },

            selected: { default: false },
            href: { default: false },
        },

        computed: {
            header() {
                return this.prefix + this.name + this.suffix;
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
                ? '#' + this.href
                : '#' + this.name.toLowerCase().replace(/ /g, '-');
        },
    };
</script>