<template>
    <div class="collect">
       <van-nav-bar title="我的收藏" left-text="返回" left-arrow fixed @click-left="back">
        </van-nav-bar>

        <div class="box" v-if="collectData.length">
            <div class="commodity-box" v-for="(v,k ) in collectData" :key="k" @click="goDetail(v.pid)">
                <div class="img-box">
                    <img :src="v.smallImg" />
                </div>
                <div class="name-box">
                    <div class="z-name">{{v.name}}</div>
                    <div class="e-name">{{v.enname}}</div>
                </div>
                <div class="price-box">
                    <div class="pcice">￥{{v.price}}</div>
                    <div class="remove">
                        <van-icon name="delete-o" @click.stop="removeCommodity(v.pid ,k)"/>
                    </div>
                </div>
            </div>
        </div>

        <div v-else>
            <van-empty description="没有收藏商品" />
        </div>
    </div>
</template>

<script>
import '../assets/less/collect.less'
    export default {
        name:'Collect',

        data(){
            return{
                // 收藏数据
                collectData:[],
            }
        },

        created() {
            this.getCollet();//获取收藏
        },

        methods:{
            //返回上一级
            back(){
                this.$router.go(-1);
            },

            //获取收藏
            getCollet(){

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
                    url: this.baseUrl + '/findAllLike',
                    params:{
                        appkey:this.appkey,
                        tokenString,
                        
                    }
                }).then(res => {
                    // console.log('res getCollet==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  2000) {
                      
                      this.collectData = res.data.result;

                    }
                        
                    // console.log('this.collectData==>',this.collectData);
                    
                        
                }).catch(err => {

                    this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                    })
                });
            },

            //查看商品详情
            goDetail(pid){
                this.$router.push({name:'Details', params:{pid}})
            },

            //删除收藏商品
            removeCommodity(pid , index){
                
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
                    method: 'POST',
                    url: this.baseUrl + '/notlike',
                    data:{
                        appkey: this.appkey,
                        pid,
                        tokenString,
                    }
                }).then(res => {

                    // console.log('removeCommodity==>' ,res);
                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  900) {
                        // 删除商品
                        this.collectData.splice(index ,1);
                        
                        
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        })
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
            }
        },
    }
</script>

