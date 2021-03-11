<template>
    <div class="search">

        <van-nav-bar :placeholder="true">
            <template #left >
                <van-cell title="返回" icon="arrow-left" @click="back"/>
            </template>
            <template #right>
                <van-search placeholder="请输入商品名称" shape="round" ref="search" show-action @search="search" v-model="name"/>
            </template>

        </van-nav-bar>


        <!-- 商品 -->
       <div class="commodity-box" v-for="(item , index) in commodityData" :key="index" @click="detailsDate(item.pid)">
            <div class="commodityImg">
                <img :src="item.smallImg" alt="">
            </div>
            <div class="name-box">
                <div class='mc-name'>{{item.name}}</div>
                <div class='n-name'>{{item.enname}}</div>
            </div>
            <div class="price-box">￥{{item.price}}</div>
        </div>
      
    </div>
</template>
<script>
import '../assets/less/Search.less'
    export default {
        name:'Search',

        data(){
            return {
                //商品关键字
                name:'',

                //搜索商品数据
                commodityData:[],
            }
        },

        created() {
            this.$nextTick(()=>{
                // console.log(this.$refs);

                //获取搜索框
                let searchIpt = this.$refs.search.querySelector('[type="search"]');

                // 获取焦点
                searchIpt.focus();


                // console.log('searchIpt==>',searchIpt);
            })
        },
        methods:{

            //返回上一级
            back(){
                this.$router.push({name:'Menu'})
            },

            //搜索
            search(){

                // 获取登录信息 cookies
                let tokenString = this.$cookies.get('tokenString');

                // 如果没有登录信息  cookies
                if(!tokenString){
                    console.log('没有浏览器cookies');
                    // 跳转到登录页面 
                    return this.$router.push({name:'Login'});
                }


                this.axios({

                    //请求方式
                    method: 'GET',
                    url: this.baseUrl + '/search',
                    params:{
                        appkey:this.appkey,
                        name:this.name,
                    }
                }).then(res => {
                    // console.log('res search==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code === "Q001") {
                        
                        this.commodityData = res.data.result ;
                        

                    }else{
                         this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        })
                    }
                        
                }).catch(err => {

                    this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                    })
                });
            },

            //跳转商品详情
            detailsDate(pid){
                // console.log('pid=>',pid);
                 this.$nextTick(function(){
                    // console.log(this.bestldata);
                })
                this.$router.push({name:'Details', params:{pid}});
               
            }
        },
    }
</script>



