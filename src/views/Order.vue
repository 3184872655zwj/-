<template>
    <div class="order">
        <van-nav-bar title="我的订单" left-text="返回" left-arrow @click-left="back">
        </van-nav-bar>

        <!-- 顶部背景 -->
        <div class="setting"></div>

        <div class="select">
            <van-tabs v-model="active" title-active-color="blue" color="blue" @change="changeOrder">
                <van-tab v-for="(v , k ) in tabs" :key="k" :title="v.title" >

                   <div class="pay-box">
                             <div v-if="orderData.length >0">

                         <div class="tab-pay" v-for="(v1, k1) in orderData" :key="k1">
                            <Paychild :pro-info="v1.proInfo">
                            <template #pay-title>
                                <div class="pay-title-box">
                                    <div class="pay-left">
                                        {{v1.oid}}
                                    </div>
                                    <div class="pay-right" v-if="v1.status == 2">
                                        <div class="pay-text">
                                           已完成
                                        </div>
                                        <div class="pay-icon" @click="removeOrder(v1.oid , k1)">
                                            <van-icon name="delete-o" />
                                        </div>
                                    </div>
                                    <div class="pay-right" v-if="v1.status == 1">
                                        <div class="pay-text" @click="confirmOrder(v1 ,k1)">
                                            确认收货
                                        </div>
                                    </div>
                                </div>
                            </template>
                                <template #article>
                                    <Clearinggoods v-for="(v , k) in v1.data" :key="k"  :product="v"></Clearinggoods>
                                </template>
                            </Paychild>
                       </div>
                    
                    </div>
                      
                       <div v-else>
                            <van-empty description="没有订单" />
                        </div>
                     
                   </div>
                </van-tab>
            </van-tabs>
        </div>


    </div>
</template>

<script>
import '../assets/less/Order.less'
import Paychild from '../components/paychild'
import Clearinggoods from '../components/Clearinggoods'
    export default {
        name:'Order',
        data(){
            return {
                active:0,

                tabs:[
                    {
                        title:'全部',
                        status:0
                    },
                    {
                        title:'进行中',
                        status:1
                    },
                    {
                        title:'已完成',
                        status:2
                    }
                ],

                orderData:[],

            }
        },
        components:{
            Paychild,
            Clearinggoods
        },
        created(){
            this.getOrderData(0);
        },

        methods:{

            back(){
                this.$router.go(-1);
            },

            //获取订单数据
            getOrderData(status){

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
                    url: this.baseUrl + '/findOrder',
                    params:{
                        appkey:this.appkey,
                        tokenString,
                        status
                        
                    }
                }).then(res => {
                    // console.log('res getOrderData==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  70000) {

                        let products = [];

                        let oids = [];

                        res.data.result.forEach(v=>{
                            v.small_img = v.smallImg;
                           
                            if(oids.indexOf(v.oid) === -1){

                                let o = {
                                    oid: v.oid,
                                    status: v.status,
                                    proInfo:{
                                        data: v.updatedAt,
                                        count: 0,
                                        total: 0,
                                    },
                                    data:[]
                                };

                                oids.push(v.oid);
                                products.push(o);

                            }
                        })

                        products.forEach(n =>{
                            
                            res.data.result.forEach(item =>{
                                if(n.oid === item.oid){
                                    n.data.push(item);
                                    n.proInfo.count += item.count;
                                    n.proInfo.total += item.count * item.price;
                                }
                            })
                        })

                        // console.log('oids==>',oids);
                        // console.log('products==>',products);

                        this.orderData = products ;
                       
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

            //切换订单状态
            changeOrder(name , title){
                console.log('name==>',name);
                console.log('title==>',title);

                this.getOrderData(name);
            },

            //确认订单
            confirmOrder(item , index){

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
                    url: this.baseUrl + '/receive',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        oid: item.oid
                        
                    }
                }).then(res => {
                    // console.log('res confirmOrder==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  80000) {

                        item.status = 2 ;

                        if(this.active == 1){
                            //移除当前订单数据
                            this.orderData.splice(index ,1)
                        }

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

            //删除订单
            removeOrder(oid , index){
               
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
                    url: this.baseUrl + '/removeOrder',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        oid
                        
                    }
                }).then(res => {
                    // console.log('res removeOrder==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  90000) {

                        this.orderData.splice(index ,1);

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
        }

    }
</script>

