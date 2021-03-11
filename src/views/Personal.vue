<template>
    <div class="personal">
           <van-nav-bar title="个人资料" left-text="返回" left-arrow fixed @click-left="back">
        </van-nav-bar>

        <div class="center">
            <van-cell-group>
                <van-cell title="头像" :center='true'>
                    <div class="head ">
                        <img :src="userinfo.userImg" alt="">
                        <van-uploader class="headimg"  :after-read="uploadUserImg" />
                    </div>
                </van-cell>
                <van-cell title="用户id" :center='true'>
                    <div>{{userinfo.userId}}</div>
                </van-cell>
                <van-cell title="手机号" :center='true'>
                    <div>{{userinfo.phone}}</div>
                </van-cell>
                <van-cell title="昵称" :center='true'>
                    <van-field class="field"  v-model="userinfo.nickName"
                    placeholder="请输入昵称"
                    @change="alterNickname"
                    maxlength='12'
                     />
                </van-cell>
                <div class="synopsis-box">
                    <div class="synopsisCenter">
                        <van-field
                            v-model="userinfo.desc"
                            rows="2"
                            autosize
                            label="简介"
                            type="textarea"
                            maxlength="30"
                            placeholder="请输入简介"
                            show-word-limit
                            @change="amenDbrief"
                        />
                    </div>
                </div>
            </van-cell-group>
        </div>

    </div>
</template>

<script>
import '../assets/less/Personal.less'
    export default {
        name:'Personal',
        data(){
            return {
                userinfo:{
                    nickName:'',
                    userId:'',
                    phone:'',
                    desc:''
                }
            }
        },
        created(){
            this.getpersonalData();//个人资料
        },

        methods:{
            // 返回上一级
            back(){
                this.$router.go(-1);
            },

            //获取个人资料
            getpersonalData(){

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
                    url: this.baseUrl + '/findAccountInfo',
                    params:{
                        appkey:this.appkey,
                        tokenString,
                       
                        
                    }
                }).then(res => {
                    // console.log('res getpersonalData==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code === "B001") {
                        
                        let data = res.data.result[0] ;
                        if(data.desc == '' ){
                            data.desc = '这家伙很懒！没留下什么'
                        }
                        this.userinfo = data;
                        

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

            //上传用户头像
            uploadUserImg(file){

                
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

            //修改昵称
            alterNickname(){

                // console.log('this.userinfo.nickName==>' ,this.userinfo.nickName);

                if(!this.userinfo.nickName){

                    this.$toast({
                            message: '昵称不能为空',
                            forbidClick: true,
                            duration: 1000
                    })
                }

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
                    url: this.baseUrl + '/updateNickName',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        nickName:this.userinfo.nickName,
                        
                    }
                }).then(res => {
                    // console.log('res alterNickname==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code === "C001") {
                        
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

            //修改简介
            amenDbrief(){

                if(!this.userinfo.nickName){

                    this.$toast({
                            message: '昵称不能为空',
                            forbidClick: true,
                            duration: 1000
                    })
                }

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
                    url: this.baseUrl + '/updateDesc',
                    data:{
                        appkey:this.appkey,
                        tokenString,
                        desc:this.userinfo.desc,
                        
                    }
                }).then(res => {
                    // console.log('res amenDbrief==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code === "C001") {
                        
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

