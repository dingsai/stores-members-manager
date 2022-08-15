<template>
	<div class="uploadContainer">
		<el-upload
            ref="files"
            :action="uploadUrl"
            list-type="picture-card"
            :multiple="multiple"
            :limit="limit"
            :headers="{'token': token, 'Authorization': token}"
            :file-list="fileList"
            :before-upload="beforeUpload"
            :on-remove="handleRemove"
            :on-success="handleSuccess"
            :on-exceed="fileExceed"
            :data="requestParam"
            v-on="$listeners"
        >
            <i slot="default" class="el-icon-plus"></i>
        </el-upload>
	</div>
</template>

<script>
import INTERFACE from '@/assets/js/interface.js';
import {STATUSCODE} from '@/assets/js/defined.js';
export default {
    props:{
        multiple:{
            type:Boolean,
            default:false
        },
        limit:{
            type:Number,
            default:1
        },
        accept:{
            type:Array,
            default:['png','jpg','jpeg']
        },
        uploadUrl:{
            type:String,
            default:''
        },
        requestParam:{
            type:Object,
            default:{}
        },
        uploadList:{
            type:Array,
            default:[]
        },
    },
	components: {
		
	},
	data(){
		return {
			fileList:[],
            token:''
		}
	},
    watch:{
        uploadList:function(newVal,oldVal){
            this.fileList = newVal;
        }
    },
	mounted(){
        this.token=this.$store.state.common.main.token || sessionStorage.getItem('token');
	},
	methods:{
		handleRemove(file) {
            let _index = 0;
            _index = this.fileList.map((item, index)=>{
                if ((item.url && item.url == file.url && item.uid == file.uid)){
                    return index;
                }
            })
            this.fileList.splice(_index,1)
            this.emitFn(file)
        },
        beforeUpload(file) {
            var isLt10M = file.size / 1024 / 1024 < 10;
            if (!isLt10M) {
                this.$message({
                    message: "上传文件大小不能超过 10MB!",
                    type: "warning"
                });
                return isLt10M;
            }
            const name=file.name;
            const suffix=name.substr(name.lastIndexOf(".")+1,name.length)
            //校验文件格式
            if(this.accept.indexOf(suffix) == -1){
                this.$message.error("请上传正确格式的文件")
                return false;
            } 
        },
        handleSuccess(response, file, fileList){
            if(response.code == STATUSCODE.code01){
                this.fileList=fileList;
                this.emitFn(file);
                return
            } 
            let uid = file.uid // 获取到uid
            let idx = this.$refs.files.uploadFiles.findIndex(item => item.uid === uid) // 查出uid对应的数据  uploadFiles是upload $refs下的方法
            this.$refs.files.uploadFiles.splice(idx, 1) // 删除该条数据
            this.$message.error(response.message)
        },
        //文件个数超出设置
        fileExceed(file,fileList){
            this.$message.warning("最多上传"+this.limit+"个文件");
        },
        //更新父组件
        emitFn(file){
            let files = []
            files = this.fileList.map(item => {
                return {
                    url:item.response.data,
                    uid:file.id
                };
            })
             this.$bus.$emit("setFileList",files)
        }
	}
}
</script>
<style lang="less">
.uploadContainer{
    text-align: left;
}
    .el-upload-list__item-name{
        display:none!important;
    }
    .el-upload-list--picture .el-upload-list__item{
        padding:10px 0 10px 90px!important;
    }

.el-upload-list__item {
    transition: none!important;
}
</style>
