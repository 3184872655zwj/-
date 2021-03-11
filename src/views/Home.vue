<template>
  <div class="home">
    <!-- 顶部搜索 -->
    <van-nav-bar :placeholder="true">
      <template #left>
        <div class="home-title">
          <div><van-icon name="manager-o" /></div>
          <div class="username">{{ userinfo.nickName }}</div>
        </div>
      </template>
      <template #right>
        <van-search placeholder="请输入商品名称" @focus="skip" shape="round" />
      </template>
    </van-nav-bar>
    <div class="content">
      <!-- 轮播 -->
      <div class="bannerBox">
        <van-swipe class="my-swipe" :autoplay="3000" indicator-color="white">
          <van-swipe-item
            v-for="(v, k) in changeCurrent"
            :key="k"
            :width="300"
            @click="detailsDate(v.pid)"
          >
            <img :src="v.bannerImg" />
            <!-- 商品名称 -->
            <div class="merchandiseName">{{ v.name }}</div>
          </van-swipe-item>
        </van-swipe>
      </div>

      <!-- 热卖 -->
      <div class="bestBox">
        <div class="best">热卖推荐</div>
      </div>

      <Seller :bestldata="bestldata"></Seller>
    </div>
  </div>
</template>

<script>
import "../assets/less/Home.less";
import Seller from "../components/Seller";
export default {
  name: "Home",
  data() {
    return {
      //轮播图数据
      changeCurrent: [],
      // 热卖推荐数据
      bestldata: {},

      // 用户信息
      userinfo: {},
    };
  },
  components: {
    Seller,
  },
  created() {
    this.carouselDate();
    this.bestlDate();
    this.getuserinfo();
  },
  methods: {
    //跳转搜索页面
    skip() {
      this.$router.push({ name: "Search" });
    },
    // 传递id
    detailsDate(pid) {
      this.$router.push({ name: "Details", params: { pid } });
    },
    // 获取轮播数据
    carouselDate() {
      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/banner",
        params: {
          appkey: this.appkey,
        },
      })
        .then((res) => {
          if (res.data.code === 300) {
            this.changeCurrent = res.data.result;
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {});
    },

    // 热卖推荐数据
    bestlDate() {
      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/typeProducts",
        params: {
          appkey: this.appkey,
          key: "isHot",
          value: 1,
        },
      })
        .then((res) => {
          // console.log(res);
          if (res.data.code === 500) {
            this.bestldata = res.data.result;
            // console.log(this.bestldata);
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }
        })
        .catch((err) => {});
    },

    //获取用户信息
    getuserinfo() {
      // 获取登录信息 cookies
      let tokenString = this.$cookies.get("tokenString");

      // 如果没有登录信息  cookies
      // if (!tokenString) {
      //   console.log("没有浏览器cookies");
      //   // 跳转到登录页面
      //   // return this.$router.push({ name: "Login" });
      // }

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/findMy",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          // console.log("res getuserinfo==>", res);

          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            // return this.$router.push({ name: "Login" });
          }

          if (res.data.code === "A001") {
            this.userinfo = res.data.result[0];
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
    },
  },
};
</script>

