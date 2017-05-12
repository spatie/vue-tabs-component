<template>
    <section
        v-show="isActive"
        :aria-hidden="! isActive"
        class="tabs-component-panel"
        :id="hash"
        role="tabpanel"
    >
        <slot />
    </section>
</template>

<script>
    export default {
        props: {
            id: { default: null },
            name: { required: true },
            prefix: { default: '' },
            suffix: { default: '' },
        },

        data: () => ({
            isActive: false,
        }),

        computed: {
            prefixNode() {
                return this.$slots.prefix || this.prefix || null;
            },

            suffixNode() {
                return this.$slots.suffix || this.suffix || null;
            },

            hash() {
                return this.id ?
                    '#' + this.id :
                    '#' + this.name.toLowerCase().replace(/ /g, '-');
            },
        },
    };
</script>
