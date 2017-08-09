<template>
    <section v-show="isActive"
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
            header() {
                return this.prefix + this.name + this.suffix;
            },

            hash() {
                let hash_suffix = this.id ? this.id : this.name.toLowerCase().replace(/ /g, '-');
                return '#' + hash_suffix;
            },
        },
    };
</script>