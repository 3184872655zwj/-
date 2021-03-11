<template>
  <div class="assets">
    <van-nav-bar
      :title="aid ? '地址管理' : '新增地址'"
      left-text="返回"
      left-arrow
      @click-left="back"
    >
    </van-nav-bar>
    <!-- 顶部背景 -->
    <div class="setting"></div>
    <div class="address-edit">
      <van-address-edit
        :area-list="assets"
        show-postal
        show-set-default
        show-search-result
        :show-delete="!!aid"
        :detail-maxlength="30"
        :area-columns-placeholder="['请选择', '请选择', '请选择']"
        @save="save"
        :address-info="initial"
        @delete="removeAddress"
      />
    </div>
  </div>
</template>

<script>
import "../assets/less/Newaddress.less";
import assets from "../assets/js/area";

export default {
  name: "Newaddress",
  data() {
    return {
      //地区数据
      assets,

      //编辑地址的aid
      aid: "",

      //编辑地址初始值
      initial: {},
    };
  },
  created() {
    //截取路由参数
    console.log(this.$route.params);
    //aid 存在才调用
    if (this.$route.params.aid) {
      this.aid = this.$route.params.aid;

      this.getAddressByaid();
    }
  },
  methods: {
    back() {
      this.$router.go(-1);
    },

    //新增地址
    add(value) {
      // 获取登录信息 cookies
      let tokenString = this.$cookies.get("tokenString");

      // 如果没有登录信息  cookies
      if (!tokenString) {
        console.log("没有浏览器cookies");
        // 跳转到登录页面
        return this.$router.push({ name: "Login" });
      }

      // 复制一份value
      let data = {
        ...value,
        tokenString,
        appkey: this.appkey,
      };

      data.isDefault = Number(data.isDefault);

      // 删除 country
      delete data.country;

      // console.log("value==>", data);

      this.axios({
        //请求方式
        method: "POST",
        url: this.baseUrl + "/addAddress",
        data,
      })
        .then((res) => {
          // console.log("res save==>", res);

          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 9000) {
            //如果添加成功 ， 跳回添加组件
            this.$router.push({ name: "Address" });
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

    //编辑地址
    edit(value) {
      // console.log('value==>',value);
      // console.log('initial==>',this.initial);

      let isEdit = false;

      for (let key in this.initial) {
        if (this.initial[key] !== value[key]) {
          //只要有一个不同，则表明用户已经修改数据
          isEdit = true;
          break;
        }
      }

      if (isEdit) {
        //发起编辑地址请求
        console.log("发起编辑地址请求==>");

        // 获取登录信息 cookies
        let tokenString = this.$cookies.get("tokenString");

        // 如果没有登录信息  cookies
        if (!tokenString) {
          console.log("没有浏览器cookies");
          // 跳转到登录页面
          return this.$router.push({ name: "Login" });
        }

        //复制value数据
        let address = {};
        address.aid = this.aid;
        address.name = value.name;
        address.tel = value.tel;
        address.province = value.province;
        address.city = value.city;
        address.county = value.county;
        address.addressDetail = value.addressDetail;
        address.areaCode = value.areaCode;
        address.postalCode = value.postalCode;
        address.isDefault = Number(value.isDefault);
        console.log("address ==> ", address);


        this.axios({
          //请求方式
          method: "POST",
          url: this.baseUrl + "/editAddress",
          data: {
            appkey: this.appkey,
            tokenString,
            ...address,
          },
        }).then((res) => {
          console.log("res edit==>", res);

          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 30000) {
            //如果添加成功 ， 跳回添加组件
            this.$router.push({ name: "Address" });
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
          }
        });

        // console.log('address',address);
      } else {
        console.log("未编辑>");
        this.$router.push({ name: "Address" });
      }
    },

    //保存地址
    save(value) {
      if (this.aid) {
        console.log("this.aid==>", this.aid);
        //编辑地址
        this.edit(value);
      } else {
        console.log("this.aid==>", this.aid);
        //新增地址
        this.add(value);
      }
    },

    //删除地址
    removeAddress(value) {
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
        url: this.baseUrl + "/deleteAddress",
        data: {
          tokenString,
          appkey: this.appkey,
          aid: value.aid,
        },
      })
        .then((res) => {
          // console.log("res save==>", res);

          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 10000) {
            //如果添加成功 ， 跳回添加组件
            this.$router.push({ name: "Address" });
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

    //根据aid获取地址数据
    getAddressByaid() {
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
        method: "GET",
        url: this.baseUrl + "/findAddressByAid",
        params: {
          appkey: this.appkey,
          tokenString,
          aid: this.aid,
        },
      })
        .then((res) => {
          // console.log("res getAddressByaid==>", res);

          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 1000,
            });
            return this.$router.push({ name: "Login" });
          }

          if (res.data.code === 40000) {
            let data = res.data.result[0];
            data.isDefault = !!data.isDefault;

            // console.log("data==>", data);
            this.initial = data;
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

