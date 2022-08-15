<template>
    <div class="block">
        <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageCurrent"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize || $store.state.common.main.pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total" :pageSize="pageSize" >
        </el-pagination>
    </div>
</template>
<script>
export default {
    props:{
        total:{
            type: [String,Number],
            default: 0
        },
        currentPage:{
            type : [String,Number],
            default: 1
        },
        pageSize:{
            type : [String,Number],
            default: 10
        }
    },
    data() {
        return {
            pageCurrent: 1,
        }
    },
    watch:{
        currentPage: function(newVal, oldVal) {
            this.pageCurrent=newVal;
        }
    },
    mounted(){
        this.$store.commit('setPageSize',this.pageSize);
    },
    methods: {
        handleSizeChange(val) {
            this.$store.commit('setPageSize',val);
            this.$emit('changePageSize',{
                pageSize: val || this.pageSize,
                pageCurrent: 1
            })
            this.$nextTick(()=>{
                this.pageCurrent= 1;
            })
        },
        handleCurrentChange(val) {
            this.pageCurrent= val;
            this.$store.commit('setPageSize',this.pageSize);
            this.$emit('changePageSize',{
                pageSize: this.pageSize,
                pageCurrent: val || 1 
            })
        }
    }
}
</script>