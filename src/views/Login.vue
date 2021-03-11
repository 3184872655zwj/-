<template>
  <div class="login">

  <!-- 登录页面顶部导航 -->
    <Rxnav></Rxnav>

    <!-- 登录大盒子 -->
    <div class="login_box">
      <div class="welcome">欢迎回来！</div>

      <!-- 表单盒子 -->
      <div class="form-box">
        <van-field label="账 号" placeholder="输入手机号(11位)" v-model="message.phone" />
        <van-field label="密 码" placeholder="输入密码(6-16位)"  
        v-model="message.password" :type="!conceal? 'text' : 'password' " :right-icon="!conceal ? 'eye-o' : 'closed-eye'"  @click-right-icon="reveal" />
      </div>
      <div class="forget">忘记密码？</div>

      <div class="register">
        <van-button block round color="#3390ff" size="small" @click="myregister">登录</van-button>

        <van-button block round size="small" class="enroll" @click="popup"
          >注册</van-button
        >
      </div>

      <!-- 弹出注册层 -->
      <van-popup
        v-model="popupEnroll"
        position="bottom"
        round
        :style="{ height: '50%' }"
        closeable
      >
        <div class="register-title">注册</div>
        <div class="form-box">
          <van-field
            label="账 号"
            placeholder="输入手机号(11位)"
            v-model="Registration.phone"
          />
          <van-field
            label="密 码"
            placeholder="输入密码(6-16位)"
            v-model="Registration.password"
            :type="!conceal ? 'text' : 'password'"
            :right-icon="!conceal ? 'eye-o' : 'closed-eye'"
            @click-right-icon="reveal"
          />
          <van-field  v-model="Registration.nickName" label="昵 称" placeholder="输入昵称(1-10位)" />
        </div>

        <div class="registerII">
          <van-button
            block
            round
            size="small"
            class="enroll"
            color="#3390ff"
            @click="register"
            >注册</van-button
          >
        </div>
      </van-popup>
    </div>
  </div>
</template>

<script>
// 登录页面顶部导航
import Rxnav from "../components/Rxnav.vue";

// 引入less样式
import "../assets/less/login.less";
// 引入表单验证js
import { utils } from "../assets/js/utils";

import {mapMutations} from "vuex"

export default {
  name: "Login",
  data() {
    return {
      //用户登录信息
      message: {
        password: "",
        phone: "",
      },
      //用户注册信息
      Registration: {
        phone: "",
        password: "",
        nickName: "",
      },

      popupEnroll: false, //弹出注册框
      conceal: true, // 显示与隐藏密码
    };
  },
  created(){
    this.changeShopbagCount(0);
    this.signshopbag(false);
  },
  components: {
    Rxnav,
  },
  methods: {

    ...mapMutations(['changeShopbagCount','signshopbag']),

    // 弹出注册框
    popup() {
      this.popupEnroll = true;
    },

    // 显示与隐藏密码
    reveal() {
      this.conceal = !this.conceal;
    },


    // 点击注册
    register() {
      let o = {
        phone: {
          value: this.Registration.phone,
          reg:/^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        password: {
          value: this.Registration.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
        },

        nickName: {
          value: this.Registration.nickName,
          reg: /^[\u4e00-\u9fa5A-Za-z0-9]{1,10}$/,
          errorMsg: "昵称支持汉字字母数字组合",
        },
      };

      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {

        return;
      }

      // 发起注册请求
      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        duration:0
      });

      this.axios({
        // 请求方式
        method:'POST',
        url:this.baseUrl + '/register',

        data:{
          appkey:this.appkey,
          nickName : this.Registration.nickName,
          password : this.Registration.password,
          phone : this.Registration.phone,
        }
      }).then(res => {

        this.$toast.clear();
        if(res.data.code == 100){
          // 关闭注册弹出层
          this.isOpen = true;
          // 清除用户注册信息
          for(let key in this.Registration){
            this.Registration[key] = '';
          }
        }else {
          this.$toast({
            message:res.data.msg,
            forbidClick:true,
            duration:3000
          })
        }
      }).catch(eer =>{
        this.$toast.clear();

      })

    },


    // 登录
    myregister(){
      let o = {
        phone: {
          value: this.message.phone,
          reg: /^1[3-9]\d{9}$/,
          errorMsg: "手机号格式不正确",
        },
        password: {
          value: this.message.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "密码支持字母数字_组合且首字符必须为字母",
        }
      };

      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {

        return;
      }

      // 发起注册请求
      this.$toast.loading({
        message:'加载中...',
        forbidClick:true,
        duration:0
      });

      this.axios({
        // 请求方式
        method:'POST',
        url: this.baseUrl + '/login',

        data:{
          appkey:this.appkey,
          password : this.message.password,
          phone : this.message.phone,
        }
      }).then(res => {

        this.$toast.clear();


        if(res.data.code == 200){

          //登录成功
          //存储token, 用于下次访问有关于用户信息界面的登录标记
          this.$cookies.set('tokenString', res.data.token, '1d');

          // 跳转到首页
          this.$router.push({name:'Home'});

        }else {
          this.$toast({
            message:res.data.msg,
            forbidClick:true,
            duration:3000
          })
        }
      }).catch(eer =>{
        this.$toast.clear();

      })

    }

  },
};
</script>