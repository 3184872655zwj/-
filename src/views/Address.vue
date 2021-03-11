<template>
    <div class="assets">
        <van-nav-bar title="地址管理" left-text="返回" left-arrow @click-left="back">
        </van-nav-bar>

        <!-- 顶部背景 -->
        <div class="setting">
          
        </div>
        <!-- 地址 -->
        <div class="location">
            <van-address-list
                default-tag-text="'默认"
                :list="list"
                :switchable="false"
                @add="add"
                @edit="edit"
            />
        </div>
    </div>
</template>

<script>
import '../assets/less/address.less'
    export default {
        name:'Address',
        data(){
            return {
                //地址列表数据
                list: [],
            };
            
        },
        created(){
            //查询用户地址列表
            this.getAddressListDate();
        },

        methods:{

            // 跳回新增地址
            add() {
                 this.$router.push({name:'Newaddress'})
            },
            back(){
                this.$router.go(-1);
            },
            //编辑地址
            edit({aid}){
               this.$router.push({name:'Newaddress', params:{aid}});
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

        }
    }
</script>

