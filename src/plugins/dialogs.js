import Dialog from '../components/Dialogs.vue';
// import Dialog from '../components/UglyDialogs.vue';

const dialogs = {
    vm: null, // 保存当前实例
    create(componentType = 'alert', Vue, installOptions, opt) {
        // 多次点击按钮时，销毁之前的弹窗
        if (this.vm) {
            document.body.removeChild(this.vm.$el);
            this.vm.$destroy();
            this.vm = null;
        }

        let btnTxt = ['确认'];
        componentType == 'confirm' && btnTxt.unshift('取消');

        let defaultOpt = {
            type: componentType,
            title: 'QQ音乐',
            content: '',
            btnTxt: btnTxt,
            width: 300,
            cb: null
        };

        if (typeof opt == 'string') {
            defaultOpt.content = opt;
        }

        opt = {...defaultOpt, ...installOptions, ...opt};

        let Dialogs = Vue.extend(Dialog);
        let vm = new Dialogs({el: document.createElement('div')});
        this.vm = vm;
        document.body.appendChild(vm.$el);

        // 赋props值给弹窗组件
        Object.assign(vm, opt);

        vm.show = true;
        vm.$on('close', (btnType) => {
            setTimeout(() => {
                document.body.removeChild(vm.$el);
                vm.$destroy();
                this.vm = null;
                typeof opt.cb == 'function' && opt.cb((componentType == 'confirm' && btnType == 1) ? 1 : 0);
            }, 400); // 缓出动画为300ms，因此延迟400ms后再销毁实例
        });
    },
    install(Vue, options) {
        Vue.prototype.$alert = (opt = {}) => {
            this.create('alert', Vue, options, opt);
        };

        Vue.prototype.$confirm = (opt = {}) => {
            this.create('confirm', Vue, options, opt);
        };

        Vue.prototype.$uploadFile = (opt = {}) => {
            let defaultOpt = {
                type: 'confirm',
                title: 'QQ音乐',
                content: '',
                btnTxt: ['取消', '确认'],
                width: 300,
                cb: null
            };

            if (typeof opt == 'string') {
                defaultOpt.content = opt;
            }

            opt = {...defaultOpt, ...options, ...opt};

            let Dialogs = Vue.extend(Dialog);

            let vm = new Dialogs({
                el: document.createElement('div')
            });
            this.vm = vm;

            // 传入slot
            const slotTemplate = `
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
                </v-flex>`;

            const renderer = Vue.compile(slotTemplate)
            const slotContent = {
                data(){
                    return {
                        uploadShow: false,
                        fileName: '',
                        label: '',
                        formData: null
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

                        this.formData = this.getFormData(files);
                    },
                    onFileInputFocus() {
                        this.$refs.fileInput.click();
                    },
                    getFormData(files) {
                        const data = new FormData();
                        [...files].forEach(file => {
                            data.append('data', file, file.name); // currently only one file at a time
                        });
                        return data;
                    }
                },
                render: renderer.render,
                staticRenderFns: renderer.staticRenderFns
            };
            vm.$slots.content = [vm.$createElement(slotContent)];

            document.body.appendChild(vm.$el);

            // 赋props值给弹窗组件
            Object.assign(vm, opt);

            vm.show = true;
            vm.$on('close', (btnType) => {
                setTimeout(() => {
                    // 不能单单document.body.removeChild(this.el);移除，蒙层还存在
                    document.body.removeChild(this.vm.$el);
                    this.vm.$destroy();
                    this.vm = null;
                    typeof opt.cb == 'function' && opt.cb(btnType == 1 ? 1 : 0, vm.$slots.content[0].child.formData);
                }, 400);
            });

        };
    }
};

export default dialogs;
