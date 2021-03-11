<template>
  <div class="home">
    <div>
      <!-- 二级路由 -->
      <router-view></router-view>
    </div>

    <!-- 底部 -->
    <van-tabbar v-model="active" route>
      <van-tabbar-item icon="wap-home" to="/home">首页</van-tabbar-item>
      <van-tabbar-item icon="new-arrival" to="/menu">菜单</van-tabbar-item>
      <van-tabbar-item icon="bag" :badge="num" to="/shopbag"
        >购物车</van-tabbar-item
      >
      <van-tabbar-item icon="manager" to="/my">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
// 导入Home less样式
import "../assets/less/Main.less";

import { mapState, mapMutations } from "vuex";

export default {
  name: "Home",
  data() {
    return {
      active: 0,
      num: 0,
    };
  },
  created() {
    this.getShopcarCount(); //获取购物袋的数目
  },
  methods: {
    //Mutations
    ...mapMutations(["changeShopbagCount", "signshopbag"]),

    // 获取购物袋的数目(不是商品总数量)
    getShopcarCount() {
      // 已经加载过的购物车数量，不再请求
      if (this.sign) {
        console.log("已经加载过的购物车数量，不再请求");
         this.num = this.shopbagCount;
        return;
      }
      // 获取登录信息 cookies
      let tokenString = this.$cookies.get("tokenString");

      // 如果没有登录信息  cookies
      if (!tokenString) {
        console.log("没有浏览器cookies");

        return;
      }

      this.axios({
        //请求方式
        method: "GET",
        url: this.baseUrl + "/shopcartRows",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();

          //cookies 不存在 不对的 没有登录
          if (res.data.code == 700) {
            return;
          }

          if (res.data.code === 8000) {
            //提交changeShopbagCount的购物车数量数据
            this.changeShopbagCount(res.data.result);

            // 购物数量显示
            this.num = this.shopbagCount;
            // console.log(res.data.result);

            this.signshopbag(true);
          }
        })
        .catch((err) => {
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          });
        });
    },
  },
  computed: {
    ...mapState(["shopbagCount", "sign"]),
  },

};
</script>


