<template>
    <div class="pay">
        <van-nav-bar title="订单结算"  left-text="返回" left-arrow @click-left="back">
        </van-nav-bar>

        <div class="pay-box">
            <div class="selectBox">
                <div class="selectaddress">
                    <div @click="display"> 选择地址</div>
                    <van-icon name="arrow" />
                </div>
                <div class="addressbox" v-if="Currentaddress.aid">
                    <div class="messageBox">
                        <div class="m-name">
                            {{Currentaddress.name}}
                        </div>
                        <div class="m-phone">
                            {{Currentaddress.tel}}
                        </div>
                        <div class="m-default" v-if="Currentaddress.isDefault">默认</div>
                    </div>
                    <div class="m-site">
                        {{Currentaddress.address}}
                    </div>
                </div>
            </div>
        </div>
        
        <!-- 结果商品 -->
        <div class="information">
            <Paychild :pro-info="proInfo">
                <template #article>
                    <Clearinggoods v-for="(v , k) in ProductData" :key="k"  :product="v"></Clearinggoods>
                </template>
            </Paychild>
        </div>
        
        <!-- 弹出地址 -->
        <van-popup v-model="show" position="bottom" closeable>
            <div class="content">
                <van-address-list
                v-model="chosenAddressId"
                :list="list"
                default-tag-text="默认"
                color="#076dab"
                @add="add"
                @select="selectAdd"
                />
            </div>
        </van-popup>

        <!-- 结算按钮 -->
        <div class="Settlement-button">
            <van-button type="primary" block round color='red' @click="account">
                立即结算
            </van-button>
        </div>

    </div>
</template>

<script>
import '../assets/less/Pay.less'
import Paychild  from '../components/paychild'
import Clearinggoods  from '../components/Clearinggoods'
import {mapMutations , mapState} from 'vuex'

    export default {
        name:'Pay',
        data(){
            return {
                show:false,//显示隐藏弹出地址

                chosenAddressId: '',
                list: [],

                //当前地址
                Currentaddress:{

                },

                //购物车id
                sids:[],

                //需要购买购物车商品数据
                ProductData:[],

                //商品总数量 、总价格
                proInfo:{
                    count:0,
                    total:0,
                }

            }
        },
        components:{
            Paychild,
            Clearinggoods
        },
        computed:{
            ...mapState(['shopbagCount'])
        },

        created(){
            //截取查询参数
            this.sids = this.$route.query.sids.split('-');

            //查询用户地址列表
            this.getAddressListDate();

            this.getShopbagData();
        },
        methods:{

            ...mapMutations(['changeShopbagCount']),

            //跳转新增地址页面
            add(){
                this.$router.push({name :'Newaddress'})
            },
            //弹出收货地址
            display(){
                this.show=true;
            },
            back(){
                this.$router.push({name:'Home'})
            },
            //选择地址
            selectAdd(item){
                this.chosenAddressId = item.id;
                this.Currentaddress = {...item};

                this.show = false;//关闭弹出地址
            },

               //查询用户地址列表
            getAddressListDate(){
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
                    url: this.baseUrl + '/findAddress',
                    params:{
                        appkey:this.appkey,
                        tokenString
                    }
                }).then(res => {
                    // console.log('res getAddressListDate==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  20000) {

                        // 添加address属性
                        res.data.result.forEach(v=>{
                            v.address = `${v.province}${v.city}${v.county}${v.addressDetail}`;

                            v.isDefault = Boolean(v.isDefault);

                            if(v.isDefault){
                               this.chosenAddressId = v.id;
                               this.Currentaddress = {...v}
                            }
                        });

                        // 赋值地址列表数据
                        this.list = res.data.result ;

                        // console.log('res.data.result==>',res.data.result);
                       
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

            //获取订单结算商品数据
            getShopbagData(){
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
                    url: this.baseUrl + '/commitShopcart',
                    params:{
                        appkey:this.appkey,
                        tokenString,
                        sids:JSON.stringify(this.sids)
                        
                    }
                }).then(res => {
                    // console.log('res getAddressListDate==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  50000) {

                        if(res.data.result.length == 0){
                                       
                            this.$router.push({name:'Home'});
                        }

                        res.data.result.forEach(v=>{
                            this.proInfo.total += v.count;
                            this.proInfo.count += v.count * v.price;
                        })

                        this.ProductData = res.data.result;
                        
                       
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

            //结算
            account(){

                if(!this.Currentaddress.aid){
                    return this.$toast({
                        message:'请选择收货地址！',
                        forbidClick: true,
                        duration: 1000
                    }) ;
                }

                 // 获取登录信息 cookies
                let tokenString = this.$cookies.get('tokenString');

                // 如果没有登录信息  cookies
                if(!tokenString){
                    console.log('没有浏览器cookies');
                    // 跳转到登录页面 
                    return this.$router.push({name:'Login'});
                }

                //获取参数
                let data = {
                  appkey: this.appkey,
                  tokenString,
                  sids:JSON.stringify(this.sids),
                  phone: this.Currentaddress.tel,
                  address: this.Currentaddress.address,
                  receiver: this.Currentaddress.name,
              };    

            //   console.log('data ==>',data);

                this.axios({

                    //请求方式
                    method: 'POST',
                    url: this.baseUrl + '/pay',
                    data
                }).then(res => {
                    // console.log('res account==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  60000) {

                        // 修改vuex购物车数量
                        this.changeShopbagCount(this.shopbagCount - this.sids.length);

                        // 跳转订单组件
                        this.$router.push({name:'Order'})
                       
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

