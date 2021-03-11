<template>
    <div class="my">
        <div class="my-bg" :style="{backgroundImage: `url(${userinfo.userBg})`}">
             <van-uploader :after-read="UploadBackground"/>
        </div>

        <div class="content-box">
            <div class="my-portrait">
                <div class="portrait">
                    <img :src="userinfo.userImg" alt="">
                    <div class="up-img">
                        <van-uploader :max-size="500 * 1024" :after-read="uploadphoto"/>
                    </div>
                </div>
                <div class="my-text">
                    <div class="name-box">{{userinfo.nickName}}</div>
                    <div class="synopsis">{{userinfo.desc ? userinfo.desc : '这家伙什么都没留下！'}}</div>
                </div>
            </div>

            <div class="my-list">
                <van-cell :title="v.title" is-link  title-style="color : #666;" v-for="(v ,k) in cellData" :key="k" @click="getPage(v.name)"/>
            </div>
        </div>
    </div>
</template>

<script>
import '../assets/less/my.less'
    export default {
        name:'My',
        data(){
            return {
                cellData: [
                    {
                        title: '个人资料',
                        name : 'Personal'
                    },
                    {
                        title: '我的订单',
                        name : 'Order'
                    },
                    {
                        title: '我的收藏',
                        name : 'Collect'
                    },
                    {
                        title: '地址管理',
                        name : 'Address'
                    },
                    {
                        title: '安全中心',
                        name : 'Center'
                    },
                ],

                userinfo:'',
            }
        },

        created(){
            this.getuserinfo();
        },

        methods:{
            getPage(name){
                this.$router.push({name})
            },

            //获取用户信息
            getuserinfo(){

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
                    url: this.baseUrl + '/findMy',
                    params:{
                        appkey:this.appkey,
                        tokenString,
                       
                        
                    }
                }).then(res => {
                    // console.log('res getuserinfo==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  'A001') {

                        this.userinfo = res.data.result[0]
                        

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

            //上传头像
            uploadphoto (file){
                // console.log('file==>',file);

                //上传文件类型
                let types = ['png','gif','jpg','jpeg'];

                let type = file.file.type.split('/')[1];
                console.log('type==>',type);

                if(types.indexOf(type) == -1){

                    return this.$toast({
                            message: `文件类型只支持${types.join(',')}图片`,
                            forbidClick: true,
                            duration: 1000
                    });
                }

                //处理base64
                let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64/, '');


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
                    url: this.baseUrl + '/updateAvatar',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        imgType:type,
                        serverBase64Img:base64
                        
                    }
                }).then(res => {
                    // console.log('res uploadphoto==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  "H001") {

                       if(res.data.result[0] === 1){
                           this.userinfo.userImg = res.data.userImg ;
                       }

                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000
                    });
                    
                        
                }).catch(err => {

                    this.$toast({
                            message: res.data.msg,
                            forbidClick: true,
                            duration: 1000
                    })
                });
            },

            //上传背景
            UploadBackground(file){
                //上传文件类型
                let types = ['png','gif','jpg','jpeg'];

                let type = file.file.type.split('/')[1];
                // console.log('type==>',type);

                if(types.indexOf(type) == -1){

                    return this.$toast({
                            message: `文件类型只支持${types.join(',')}图片`,
                            forbidClick: true,
                            duration: 1000
                    });
                }

                //处理base64
                let base64 = file.content.replace(/data:image\/[A-Za-z]+;base64/, '');


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
                    url: this.baseUrl + '/updateUserBg',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        imgType:type,
                        serverBase64Img:base64
                        
                    }
                }).then(res => {
                    // console.log('res UploadBackground==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  "I001") {

                       if(res.data.result[0] === 1){
                           this.userinfo.userBg = res.data.userBg ;
                       }

                    }
                    this.$toast({
                        message: res.data.msg,
                        forbidClick: true,
                        duration: 1000
                    });
                    
                        
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