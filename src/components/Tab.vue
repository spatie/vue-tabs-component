<template>
    <div v-show="isActive">
        <slot></slot>
    </div>
</template>

<script>
    export default {
        props: {
            name: { required: true },
            namePrefix: { default: '' },
            nameSuffix: { default: '' },

            selected: { default: false },
            href: { default: false },
        },

        computed: {
            header() {
                return this.namePrefix + this.name + this.nameSuffix;
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