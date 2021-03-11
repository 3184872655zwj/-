<template>
    <div class="details">
        <van-nav-bar title="商品详情" left-text="返回" left-arrow @click-left="back">
  
        </van-nav-bar>
        <!-- 图片 -->
        <div class="imgBox">
            <img :src='detailData.large_img' class="img"/>
        </div>
        <!-- 详情 -->
        <div class="particularsBox">
            <!-- 商品名称 -->
            <div class="productNameBox">
                <div class="nameBox">
                    <div class="ch-name">{{detailData.name}}</div>
                    <div class="en-name">{{detailData.enname}}</div>
                </div>
                <!-- 价格 -->
                <div class="price">￥{{detailData.price}}</div>
            </div>

            <!-- 规格 -->
            <div class="rules">
                <div class="rule" v-for="(v1, i1) in detailData.rulesData" :key="i1">
                <div class="rule-title">{{v1.title}}</div>

                <div class="rule-items">
                    <div
                    :class="{active: v1.currentIndex === i2}"
                    v-for="(v2, i2) in v1.rule"
                    :key="i2"
                    @click="selectRule(v1, i2)"
                    >{{v2.title}}</div>
                </div>
                </div>
            </div>


            <!-- 数量 -->
            <div class="count-box">
                <div class="select-count">选择数量</div>
                <div class="count">
                    <van-stepper v-model="count" theme="round" button-size="22" disable-input />
                </div>
            </div>

           <!-- 描述 -->
            <div class="desc">
                    <div class="desc-title">商品描述</div>
                    <div class="desc-text">
                    <div v-for="(item, index) in detailData.desc" :key="index">{{index + 1}}、{{item}}</div>
                    </div>
                </div>
            </div>


           <van-goods-action>
                <van-goods-action-icon icon="bag" text="购物车" color="#666" :badge='shopbagCount > 0 ?shopbagCount : "" ' @click="goShopbag"/>
                <van-goods-action-icon icon="like" :text="likeStatus ? ' 已收藏' : '收藏' " :color=" likeStatus ? 'red' : '#666' "  @click="likeAndNotLike"/>
                <van-goods-action-button color="#6A91EC" type="warning" text="加入购物袋" @click="addShopbag(false)" />
                <van-goods-action-button color="#0C34BA" type="danger" text="立即购买" @click="buyImmediately"/>
            </van-goods-action>

        </div>
</template>

<script>
import '../assets/less/details.less'
import {mapState , mapMutations} from 'vuex'

    export default {
        name:'Details',
        data(){
            return {
                pid:'',//商品id
                //商品详情数据
                detailData: {},

                //收藏颜色状态
                likeStatus: false,

                //选择数量
                count:1,
            }
        },
        created(){
            // 截取pid
            this.pid = this.$route.params.pid;

            this.carouselDate();//获取商品详情数据

            this.getLikeProduct();//查询当前商品是否被收藏

            this.getShopcarCount();//获取购物袋的数目
            
        },
        methods:{

            ...mapMutations(['changeShopbagCount','signshopbag']),

            back(){
                this.$router.go(-1);
            },
           //获取商品详情数据
            carouselDate(){

                this.axios({

                    //请求方式
                    method: 'GET',
                    url: this.baseUrl + '/productDetail',
                    params:{
                        appkey: this.appkey,
                        pid: this.pid,
                    }
                }).then(res => {
                    this.$toast.clear();

                    if (res.data.code ===  600) {

                        let  data = res.data.result[0];
                        // console.log(data);
                        //处理res
                        let rules = ['cream', 'tem', 'sugar', 'milk'];
                        //保存处理规格数据
                        data.rulesData = [];

                        rules.forEach(v => {
                            //如果不存在规格，则不添加到data.rulesData
                            if (!data[v]) {
                                return;
                            }
                            let rulesText = data[v].split('/');

                            let currentRule = {
                                title: data[v + '_desc'],
                                currentIndex: 0,
                                rule: []
                            };
                            rulesText.forEach(item => {
                                let o = {
                                    title: item
                                }
                                currentRule.rule.push(o);
                            })
                            data.rulesData.push(currentRule);

                        });

                        //处理商品描述信息
                        data.desc = data.desc.split(/\n/);
                        // console.log('data ==> ', data);
                        this.detailData = data;
                    } else {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000
                        })
                    }
                        
                }).catch(err => {

                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000
                    })
                });


            },

             //选择规格
            selectRule(item, index) {
            //如果点击相同rule
            if (item.currentIndex === index) {
                return;
            }

            item.currentIndex = index;
            },

             //收藏或者取消收藏
            likeAndNotLike() {
                if (this.likeStatus) {
                    //取消收藏
                    this.notlike();
                } else {
                    //收藏
                    this.like();
                }
            },
            
            //收藏
            like(){
                
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
                    url: this.baseUrl + '/like',
                    data:{
                        appkey: this.appkey,
                        pid: this.pid,
                        tokenString,
                    }
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    // console.log(res)
                    if (res.data.code ===  800) {

                        // 收藏颜色
                        this.likeStatus = true;
                    } else {
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

            //查询当前商品是否被收藏
            getLikeProduct(){
                 // 获取登录信息 cookies
                let tokenString = this.$cookies.get('tokenString');

                // 如果没有登录信息  cookies
                if(!tokenString){
                    console.log('没有浏览器cookies');
                   
                    return 
                }

                this.axios({

                    //请求方式
                    method: 'GET',
                    url: this.baseUrl + '/findlike',
                    params:{
                        appkey: this.appkey,
                        pid: this.pid,
                        tokenString,
                    }
                }).then(res => {
                    this.$toast.clear();

                    // console.log('res getLikeProduct==>',res)

                    //cookies 不存在 不对的
                    if(res.data.code == 700){

                        return 
                    }

                    
                    if (res.data.code ===  1000) {
                        // 收藏成功过

                        if(res.data.result.length > 0){
                            // 收藏颜色显示
                            this.likeStatus = true;
                        }
                        
                    } 
                        
                }).catch(err => {

                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000
                    })
                });
            },

            //取消收藏
            notlike(){
                
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
                        pid: this.pid,
                        tokenString,
                    }
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:3000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    // console.log('res notLike==>',res)

                    if (res.data.code ===  900) {

                        if(res.data.result === 1){

                            // 取消收藏颜色
                            this.likeStatus = false;
                        }
                        

                    } else {
                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 3000
                        })
                    }
                        
                }).catch(err => {

                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 3000
                    })
                });
            },

            //添加购物车
            addShopbag(isBuy){

                // 获取登录信息 cookies
                let tokenString = this.$cookies.get('tokenString');

                // 如果没有登录信息  cookies
                if(!tokenString){
                    console.log('没有浏览器cookies');
                    // 跳转到登录页面 
                    return this.$router.push({name:'Login'});
                }

                //拿到商品规格
                let rules = [];
                this.detailData.rulesData.forEach(v =>{

                    rules.push(v.rule[v.currentIndex].title);
                   

                });
                //  console.log(rules);


                this.axios({

                    //请求方式
                    method: 'POST',
                    url: this.baseUrl + '/addShopcart',
                    data:{
                        appkey: this.appkey,
                        pid: this.pid,
                        tokenString,
                        count:this.count,
                        rule:rules.join('/')

                    }
                }).then(res => {
                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    // console.log('res addShopbag==>',res)

                    if (res.data.code === 3000) {

                        // 添加购物车的数量
                        if(res.data.status === 1){
                            
                            // 提交mutsations
                            this.changeShopbagCount(this.shopbagCount + 1);
                        }

                        this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                        })

                        if(isBuy){
                            
                            // 跳转结算页面
                            this.$router.push({name: "Pay" , query:{sids : res.data.sid}})
                        }

                    } else {
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


            //跳转到购物袋页面
            goShopbag(){
                this.$router.push({name:'Shopbag'})
            },


             // 获取购物袋的数目(不是商品总数量)
            getShopcarCount(){

                // 已经加载过的购物车数量，不再请求
                if(this.sign){
                    console.log('已经加载过的购物车数量，不再请求');
                return ;
                }
                // 获取登录信息 cookies
                let tokenString = this.$cookies.get('tokenString');

                // 如果没有登录信息  cookies
                if(!tokenString){
                    console.log('没有浏览器cookies');
                    
                    return 
                }

                this.axios({

                    //请求方式
                    method: 'GET',
                    url: this.baseUrl + '/shopcartRows',
                    params:{
                        appkey: this.appkey,
                        tokenString,
                    }
                }).then(res => {
                    this.$toast.clear();

                    //cookies 不存在 不对的 没有登录
                    if(res.data.code == 700){
                        return 
                    }

                    if (res.data.code ===  8000) {
                        
                        //提交changeShopbagCount的购物车数量数据
                        this.changeShopbagCount(res.data.result);
                        console.log(this.shopbagCount);
                        // 购物数量显示
                        this.num=this.shopbagCount;

                        this.signshopbag(true);


                    } 
                        
                }).catch(err => {

                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000
                    })
                });
            },

            //立即购买
            buyImmediately(){
                this.addShopbag(true);
            }


        },
        computed:{
            // 获取添加购物车数量显示
            ...mapState(['shopbagCount','sign']),
        },

    }
</script>

