<template>
    <v-dialog v-model="dialogShow" persistent :width="width" :hide-overlay="hideOverlay">
        <v-card style="background:#fff;">
            <v-card-title>
                <div class="headline">
                    <template v-if="title">
                        {{title}}
                    </template>
                    <slot v-else name="title"></slot>
                </div>
            </v-card-title>
            <v-card-text v-if="content" v-html="content"></v-card-text>
            <slot v-else name="content"></slot>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn
                    v-for="(item, idx) in btnTxt"
                    v-if="type == 'confirm' || (type == 'alert' && idx == 0)"
                    :key="idx"
                    class="green--text darken-1"
                    flat="flat"
                    @click.native="closeDialog(idx)"
                >
                    {{item}}
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>
export default {
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: '提示'
        },
        content: {
            type: String,
            default: ''
        },
        type: {
            type: String,
            default: 'alert'
        },
        btnTxt: {
            type: Array,
            default: function () {
                return ['我知道了'];
            }
        },
        width: {
            type: Number,
            default: 300
        },
        hideOverlay: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            dialogShow: this.show
        }
    },
    watch: {
        show(showUp) {
            this.dialogShow = showUp;
        }
    },
    methods: {
        closeDialog(btnNo) {
            this.dialogShow = false;
            this.$emit('close', btnNo);
        }
    }
}
</script>
