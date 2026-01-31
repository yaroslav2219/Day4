export const toogle = {
    props: {
        modelValue: {
            type: Boolean,
            default: false
        }
    },

    emits: ['update:modelValue'],

    data() {
        return {
            value: this.modelValue
        }
    },

    watch: {
        modelValue(newVal) {
            this.value = newVal;
        }
    },

    methods: {
        change() {
            this.$emit('update:modelValue', this.value);
        }
    },

    template: `
    <label class="switch">
        <input type="checkbox" v-model="value" @change="change">
        <span class="slider round"></span>
    </label>
    `
};
