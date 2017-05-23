export default {
    functional: true,

    props: {
        contents: { required: true },
    },

    render(h, context) {
        const contents = context.props.contents;

        if (typeof contents === 'string') {
            return h('span', contents);
        }

        return contents;
    },
};
