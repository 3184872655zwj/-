<template>
  <div class="center">
    <van-nav-bar
      title="安全中心"
      left-text="返回"
      left-arrow
      @click-left="back"
      fixed
    >
    </van-nav-bar>

    <div class="box">
      <div class="amend">
        <van-cell title="修改密码" is-link @click="amend" />
        <van-cell title="注销账号" is-link @click="closeAccount" />
      </div>
      <div class="button">
        <van-button type="primary" block @click="logOut">退出登录</van-button>
      </div>
    </div>

    <!-- 弹出地址 -->
    <van-popup v-model="popupEnroll" position="bottom" closeable>
      <!-- 弹出注册层 -->
      <van-field
        label="旧密码"
        placeholder="输入旧密码(6-16位)"
        v-model="userInfo.oldpassword"
        :type="!isPassword ? 'text' : 'password'"
        :right-icon="!isPassword ? 'eye-o' : 'closed-eye'"
        @click-right-icon="toggleType"
      />
      <van-field
        label="新密码"
        placeholder="输入新密码(6-16位)"
        v-model="userInfo.password"
        :type="!isPassword ? 'text' : 'password'"
        :right-icon="!isPassword ? 'eye-o' : 'closed-eye'"
        @click-right-icon="toggleType"
      />

      <van-button
        block
        round
        size="small"
        class="enroll"
        color="#3390ff"
        @click="submit"
        >确定</van-button
      >
    </van-popup>
  </div>
</template>

<script>
// 引入表单验证js
import { utils } from "../assets/js/utils";

import "../assets/less/Center.less";
export default {
  name: "Center",

  data() {
    return {
      popupEnroll: false,

      isPassword: true,
      userInfo: {
        oldpassword: "", //旧密码
        password: "", //密码
      },
    };
  },

  methods: {
    // 返回上一级
    back() {
      this.$router.go(-1);
    },

    //修改弹窗
    amend() {
      this.popupEnroll = true;
    },

    //小眼睛
    toggleType() {
      this.isPassword = !this.isPassword;
    },

    //注销账号
    closeAccount() {
      // 获取登录信息 cookies
      let tokenString = this.$cookies.get("tokenString");

      // 如果没有登录信息  cookies
      if (!tokenString) {
        console.log("没有浏览器cookies");
        // 跳转到登录页面
        return this.$router.push({ name: "Login" });
      }

      this.$dialog
        .confirm({
          title: "注销账号",
          message: "是否确定注销账号，一旦注销就无法恢复",
          confirmButtonColor: "blue",
          // showConfirmButton:true,
        })
        .then(() => {
          this.axios({
            //请求方式
            method: "POST",
            url: this.baseUrl + "/destroyAccount",
            data: {
              appkey: this.appkey,
              tokenString,
            },
          })
            .then((res) => {
              // console.log("res closeAccount==>", res);

              this.$toast.clear();

              if (res.data.code == 700) {
                this.$toast({
                  message: res.data.msg,
                  forbidClick: true,
                  duration: 1000,
                });
                return this.$router.push({ name: "Login" });
              }

              if (res.data.code === "G001") {
                // 清除登录状态
                setTimeout(() => {
                  localStorage.removeItem("tokenString");

                  // 跳转登录页面
                  this.$router.push({ name: "Login" });
                }, 800);
              } else {
                this.$toast.clear();
                this.$toast({
                  message: res.data.msg,
                  forbidClick: true,
                  duration: 1000,
                });
              }
            })
            .catch((err) => {
              this.$toast.clear();
              this.$toast({
                message: res.data.msg,
                forbidClick: true,
                duration: 1000,
              });
            });
        });
    },

    //退出登录
    logOut() {

      // // 获取登录信息 cookies
      // let tokenString = this.$cookies.get("tokenString");

      // // 如果没有登录信息  cookies
      // if (!tokenString) {
      //   console.log("没有浏览器cookies");
      //   // 跳转到登录页面
      //   return this.$router.push({ name: "Login" });
      // }

      this.$dialog
        .confirm({
          title: "退出登录",
          message: "是否退出登录",
          confirmButtonColor: "blue",
          showConfirmButton: true,
        })
        .then(() => {
          // 清除登录状态
          setTimeout(() => {
            // localStorage.removeItem("tokenString");
            this.$cookies.remove('tokenString')

            // 跳转登录页面
            this.$router.push({ name: "Login" });
          }, 800);

          return;
        });
    },

    //提交修改密码
    submit() {
      this.popupEnroll = false;
      let o = {
        oldpassword: {
          value: this.userInfo.oldpassword,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "旧密码支持字母数字_组合且首字符必须为字母",
        },
        password: {
          value: this.userInfo.password,
          reg: /^[A-Za-z]\w{5,15}$/,
          errorMsg: "新密码支持字母数字_组合且首字符必须为字母",
        },
      };

      //验证表单
      //表单验证不通过, 拦截注册请求
      if (!utils.validForm(o)) {
        return;
      } else {
        if (this.userInfo.oldpassword == this.userInfo.password) {
          this.$toast({
            message: "新密码和旧密码不能相同",
            forbidClick: true,
            duration: 3000,
          });

          return;
        }

        // 获取登录信息 cookies
        let tokenString = this.$cookies.get("tokenString");

        // 如果没有登录信息  cookies
        if (!tokenString) {
          console.log("没有浏览器cookies");
          // 跳转到登录页面
          return this.$router.push({ name: "Login" });
        }

        this.axios({
          //请求方式
          method: "POST",
          url: this.baseUrl + "/updatePassword",
          data: {
            appkey: this.appkey,
            tokenString,
            password: this.userInfo.password,
            oldPassword: this.userInfo.oldpassword,
          },
        })
          .then((res) => {
            // console.log('res getuserinfo==>',res)

            this.$toast.clear();

            if (res.data.code == 700) {
              this.$toast({
                message: res.data.msg,
                forbidClick: true,
                duration: 1000,
              });
              return this.$router.push({ name: "Login" });
            }

            if (res.data.code === "E001") {
              // 清除登录状态
              setTimeout(() => {
                localStorage.removeItem("tokenString");

                // 跳转登录页面
                this.$router.push({ name: "Login" });
              }, 800);
            } else {
              this.$toast({
                message: res.data.msg,
                forbidClick: true,
                duration: 1000,
              });
            }
          })
          .catch((err) => {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
          });
      }
    },
  },
};
</script>

