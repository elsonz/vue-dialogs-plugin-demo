<template>
  <v-app id="inspire">
    <v-content>
        <v-container>
            <v-layout row>
                <v-flex xs2>
                        <v-subheader>插件模式</v-subheader>
                    </v-flex>
                <v-flex xs2>
                    <v-btn @click="onAlertPlugin" color="success red">alert</v-btn>
                </v-flex>
                <v-flex xs2>
                    <v-btn @click="onConfirmPlugin" color="success indigo">confirm</v-btn>
                </v-flex>
                <v-flex xs2>
                    <v-btn @click="onDoubleCheckPlugin" color="success blue">doubleCheck</v-btn>
                </v-flex>
                <v-flex xs2>
                    <v-btn @click="onUploadPlugin" color="success green">上传文件</v-btn>
                </v-flex>
            </v-layout>
            <v-layout row>
                <v-flex xs2>
                        <v-subheader>组件模式</v-subheader>
                </v-flex>
                <v-flex xs4>
                    <v-btn @click="uploadShow = true;" color="success red">上传</v-btn>
                </v-flex>
            </v-layout>
        </v-container>
    </v-content>

    <!-- 文件上传弹窗 -->
    <Dialogs :show="uploadShow" title="导入文件" type="confirm" :btnTxt="['取消', '上传']" @close="uploadClose">
        <template slot="content">
            <v-flex xs10 offset-xs1 class="mr10">
                <v-text-field
                    prepend-icon="attachment"
                    single-line
                    v-model="fileName"
                    :label="label"
                    required
                    readonly
                    ref="fileTextField"
                    @click.native="onFileInputFocus"
                ></v-text-field>
                <input type="file" :style="{position:'absolute', left: '-9999px'}" :multiple="true" ref="fileInput" @change="onFileChange">
            </v-flex>
        </template>
    </Dialogs>
  </v-app>
</template>

<script>
import Dialogs from './components/Dialogs.vue';
export default {
    name: 'app',
    components: {
        Dialogs
    },
    data() {
        return {
            uploadShow: false,
            fileName: '',
            label: '请上传文件',
        };
    },
    watch: {
        fileName(name) {
            if (name) {
                this.label = name;
            } else {
                this.label = '请上传文件';
            }
        }
    },
    methods: {
        onFileChange($event) {
            const files = $event.target.files || $event.dataTransfer.files;
            if (files) {
                if (files.length > 0) {
                    this.fileName = [...files].map(file => file.name).join(', ');
                } else {
                    this.fileName = null;
                }
            } else {
                this.fileName = $event.target.value.split('\\').pop();
            }
        },
        onFileInputFocus() {
            this.$refs.fileInput.click();
        },
        uploadClose(type, btnNo) {
            this.uploadShow = false;
            console.log(type, btnNo);
        },
        onAlertPlugin() {
            this.$alert('你好');
        },
        onConfirmPlugin() {
            this.$confirm({
                hideOverlay: false,
                title: '我是弹窗',
                content: '你好',
                btnTxt: ['取消', '呵呵']
            });
        },
        onDoubleCheckPlugin() {
            this.$confirm({
                content: '二次确认',
                btnTxt: ['取消', '不要拦我'],
                cb: (btnType) => {
                    if (btnType == 1) {
                        this.$confirm({
                            content: '三次确认',
                            btnTxt: ['好吧我放弃', '去意已决'],
                            cb: (btnType) => {
                                btnType == 1 && this.$alert('成功rm -rf /*');
                            }
                        });
                    }
                }
            });
        },
        onUploadPlugin() {
            this.$uploadFile({
                cb: (btnType, fileData) => {
                    btnType == 1 && this.$alert('上传成功');
                }
            });
        }
    }
};
</script>

