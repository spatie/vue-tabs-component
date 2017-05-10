<template>
    <div :id="id" v-show="isActive">
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
            id: { default: null },
        },

        computed: {
            header() {
                return this.prefix + this.name + this.suffix;
            },

            hash() {
                return this.id ?
                    '#' + this.id :
                    '#' + this.name.toLowerCase().replace(/ /g, '-');
            },
        },

        data() {
            return {
                isActive: false,
            };
        },
    };
</script>