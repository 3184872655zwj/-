<template>
  <div class="Shopbag">

    <van-nav-bar
      title="购物袋"
      left-text="返回"
      left-arrow
      @click-left="back"
    >
      <template #right>
        <div @click="compiles" v-if="shopbagDate.length > 0">{{compile ? '编辑' : '完成'}}</div>
      </template>
    </van-nav-bar>

    <!-- 顶部背景图 -->
    <div class="setting"></div>

    <div v-if="shopbagDate.length > 0">

        <div class="commodityBox">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有啦，还拉！"
            @load="onLoad"
            offset='100'
          >
            <!-- 商品 -->
            <van-swipe-cell :disabled="!compile" v-for="(v , k) in shopbagDate" :key="v.sid">
              <div class="commodity">
                <!-- 单选 -->
                <div class="checkBox">
                  <van-checkbox v-model="v.isChecked" @change="MultipleChoice"></van-checkbox>
                </div>
                <!-- 图片 -->
                <div class="imgBox">
                  <img
                    :src="v.small_img"
                  />
                </div>
                <!-- 商品名称 -->
                <div class="productNameBox">
                  <div class="nameBox">
                    <div class="zh-name">{{v.name}}</div>
                    <div class="dosing">{{v.rule}}</div>
                  </div>
                  <div class="yw-name">{{v.enname}}</div>
                  <div class="priceBox">
                    <div class="price">￥{{v.price}}</div>
                    <div class="select">
                      <van-stepper
                        v-model="v.count"
                        theme="round"
                        button-size="22"
                        disable-input
                        @change="commodityquantity(v. sid , v.count )"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <template #right>
                <van-button square type="danger" text="删除" @click="singledelete([v.sid ], k)"/>
              </template>
            </van-swipe-cell>

          </van-list>

        </div>


        <!-- <van-cell v-for="item in list" :key="item" :title="item" /> -->

          <van-submit-bar :price="total" button-text="提交订单" v-show="compile" @click="submit" @submit="commit">
            <van-checkbox v-model="checked" @click="allcheck">
              全选
            </van-checkbox>
        </van-submit-bar>

        <!-- 编辑时 -->
        <van-submit-bar button-text="删除" @submit="removeSelect" v-show="!compile">
          <van-checkbox v-model="checked" @click="allcheck">全选</van-checkbox>
        </van-submit-bar>
      </div>

   
      <div v-else>
        <!-- 购物车没有商品，请去逛一逛 -->
        <van-empty description="购物车没有商品，请去逛一逛！" >
           <van-button round type="danger" class="bottom-button" @click="goHome">请去逛一逛</van-button>
        </van-empty>
      </div>
        

    </div>

</template>



<script>
import "../assets/less/shopbag.less";
import {mapMutations , mapState} from 'vuex'
export default {
  name: "Shopbag",
  data() {
    return {
      //编辑 / 完成
      compile: true,

      // 全选 / 取消全选
      checked:false,

      // 购物车数据
      shopbagDate:[],

      //是否加载 , 首次不触发加载
      loading:true,

      //是否全部加载完
      finished:false,

      //购物车所有数据
      shopbagAllDate:[],

      //开始截取位置
      statr:0,

      //每次拿多少条数据
      count:7,

      //总金额
      total:0,
    };
  },
  created() {
    this.getshopbagDate(); //购物车商品数据
  },
  computed:{
    ...mapState(['shopbagCount'])
  },
  methods: {

    ...mapMutations(['changeShopbagCount']),


    // 购物车商品数据
    getshopbagDate() {
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
        url: this.baseUrl + "/findAllShopcart",
        params: {
          appkey: this.appkey,
          tokenString,
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          // console.log("res getshopbagDate", res);
          if (res.data.code === 5000) {

            // 处理数据
            res.data.result.forEach(v=>{
              v.isChecked = false
            })
      
            this.shopbagAllDate = res.data.result;

            this.shopbagDate = this.shopbagAllDate.slice(this.statr , this.count +this.statr);

            this.statr += this.count;


            if(this.shopbagAllDate.length < this.count){
              this.finished = true;
              return ;
            }

            //下次触底进行加载
            this.loading = false;

          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
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

    back() {
      this.$router.go(-1);
    },

    //提交订单
    submit(){
      // 跳转
      // this.$router.push({name:'Address'});
    },

    goHome(){
      this.$router.push({name:'Home'});
    },

    // 懒加载数据
    onLoad(){
      setTimeout(()=>{


          let data = this.shopbagAllDate.slice(this.statr , this.count + this.statr);

          // 如果本次截取不足this.count条数据，下次不可能有数据
          if(data.length < this.count ){
            console.log('已经加载完成数据...');
            this.finished = true;
            return;
          }

          this.shopbagDate.push(...data);

          this.statr += this.count;

          //是否取消全选
          if(data.length > 0 ){
              this.checked = false ;
          }

          //下次进行触底加载
          this.loading = false;

      },1000)
      
    },

    // 修改商品数量
    commodityquantity(sid ,count){

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
        url: this.baseUrl + "/modifyShopcartCount",
        data: {
          appkey: this.appkey,
          tokenString,
          sid,
          count

        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          // console.log("res commodityquantity", res);
          if (res.data.code === 6000) {
            
            this.sum();
            
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
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

    compiles() {
      //更改编辑 / 完成
      this.compile = !this.compile;
    },

    //全选
    allcheck (){
      //将所有单选状态修改为全选状态
      this.shopbagDate.forEach(v=>{
        v.isChecked = this.checked;
      });

      this.sum();
    },

    //单选
    MultipleChoice(){
      this.sum();

      //只要有一个单选没有选，全选不勾选
      for(let i = 0; i< this.shopbagDate.length; i++){
        if(!this.shopbagDate[i].isChecked){

          this.checked = false;
          return ;
        }
      }

      this.checked = true;
    },

    //单个删除购物车数据
    singledelete(sids , index){

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
        url: this.baseUrl + "/deleteShopcart",
        data: {
          appkey: this.appkey,
          tokenString,
          sids:JSON.stringify(sids)
        },
      })
        .then((res) => {
          this.$toast.clear();

          if (res.data.code == 700) {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
            return this.$router.push({ name: "Login" });
          }

          // console.log("res singledelete", res);
          if (res.data.code == 7000) {

            if(index != undefined){
              // 删除成功，就删除一个商品
              this.shopbagDate.splice(index , 1);

              this.changeShopbagCount(this.shopbagCount - 1);

              //调用单选
              this.MultipleChoice();

            }else{
              // 多个删除
              for( let i =0; i<this.shopbagDate.length ; i++){
                if(this.shopbagDate[i].isChecked) {
                  this.shopbagDate.splice(i ,1);
                  i-- ;
                }
              }

              this.changeShopbagCount(this.shopbagCount - sids.length);
            }

            //调用全选
            this.sum();
            
          
          } else {
            this.$toast({
              message: res.data.msg,
              forbidClick: true,
              duration: 3000,
            });
          }

          this.$nextTick(()=>{
            let cells = document.querySelectorAll('.commodity');
            // console.log('cells==>',cells);

            if(cells.length === 0 && this.shopbagDate.length < this.shopbagAllDate.length){
              //触发懒加载数据
              this.onLoad();
            }else{

              // 获取最后一个节点尺寸
              let cellSzie = cells[cells.length - 1].getBoundingClientRect();

              // 获取最后一个节点距离顶部的距离
              let distance = cellSzie.top;

              // 获取最后一个节点的高度
              let cellHeight = cellSzie.height;

              // 获取屏幕高度
              let innerHeight = window.innerHeight;

              if(distance + cellHeight - innerHeight <= 50){

                //触发懒加载数据
                this.onLoad();
              }
            }
          })


        })
        .catch((err) => {
          this.$toast({
            message: res.data.msg,
            forbidClick: true,
            duration: 3000,
          });
        });

    },

    //删除选择的购物车商品
    removeSelect( ){

      //获取被勾选的id
      let sids = [];
      this.shopbagDate.forEach(v=>{
        if( v.isChecked){
          sids.push(v.sid);
        }
      });

      if(sids.length == 0){
         this.$toast({
              message: '请选择删除商品！',
              forbidClick: true,
              duration: 3000,
            });

            return ;
      }
      //单个删除购物车数据
      this.singledelete(sids);

      // console.log('sids==>',sids);
    },

    //计算勾选商品总金额
    sum(){
      // 重置总计
      let total = 0;

      this.shopbagDate.forEach(v=>{
        if(v.isChecked){
          total += v.price * v.count ;
        }
      });

      // 放大一百倍
      this.total = total *100 ;
    },

    //提交定单
    commit(){

       //获取被勾选的id
      let sids = [];
      this.shopbagDate.forEach(v=>{
        if( v.isChecked){
          sids.push(v.sid);
        }
      });

      if(sids.length == 0){
         this.$toast({
              message: '请选择下单商品！',
              forbidClick: true,
              duration: 3000,
        });

        return ;
      }

      // 跳转
      this.$router.push({name:'Pay', query:{sids : sids.join('-')}});
      
      // console.log('sids==>',sids);
    },
  },


};
</script>

