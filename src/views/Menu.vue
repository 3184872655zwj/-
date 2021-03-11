<template>
    <div class="Menu">
            <van-search
                shape="round"
                background="#fff"
                placeholder="请输入搜索关键词"
                @focus="skip"
            />
        <div class="menu-option">
            <div class="menu-item" v-for="(v , k) in menuDate" :key="k" @click="switchover(k , v.type)">
                <div class="menu-m">
                     <div class="m-img">
                         <img :src="index == k ? v.acitveIcon : v.noAcitveIcon " alt="">
                     </div>
                    <div class="m-name" :class="{active : k == index}">{{v.title}}</div>
                </div>
            </div>
        </div>

        <div class="commodity-box" v-for="(item , index) in ProductData" :key="index" @click="detailsDate(item.pid)">
            <div class="commodityImg">
                <img :src="item.smallImg" alt="">
            </div>
            <div class="name-box">
                <div class='mc-name'>{{item.name}}</div>
                <div class='n-name'>{{item.enname}}</div>
            </div>
            <div class="price-box">￥{{item.price}}</div>
        </div>

    </div>
</template>

<script>
import '../assets/less/Menu.less'
    export default {
        name:'Menu',
        data(){
            return {

                //选择下标
                index:0,

                menuDate:[
                    {
                        title:'推荐',
                        acitveIcon: require('../assets/images/icons_21.gif'),
                        noAcitveIcon: require('../assets/images/icons_09.gif'),
                    },
                    {
                        title:'拿铁',
                        acitveIcon: require('../assets/images/icons_19.gif'),
                        noAcitveIcon: require('../assets/images/icons_05.gif'),
                    },
                    {
                        title:'咖啡',
                        acitveIcon: require('../assets/images/icons_18.gif'),
                        noAcitveIcon: require('../assets/images/icons_03.gif'),
                    },
                    {
                        title:'瑞纳冰',
                        acitveIcon: require('../assets/images/icons_20.gif'),
                        noAcitveIcon: require('../assets/images/icons_07.gif'),
                    },
                ],

                //商品数据
                ProductData:[],
            }
        },
        created(){
            this.getTpes();//获取商品类型
        },
        methods:{
            //跳转搜索页面
            skip(){

                this.$router.push({name:'Search'})
            },

            // 切换菜单
            switchover(i ,type){
                if(this.index == i){
                    return ;
                }
                this.index = i;

                this.getItemsbyType(type);
            },

            //获取商品类型
            getTpes(){

                this.axios({

                    //请求方式
                    method: 'GET',
                    url: this.baseUrl + '/type',
                    params:{
                        appkey:this.appkey,
                    }
                }).then(res => {
                    // console.log('res getTpes==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if (res.data.code ===  400) {

                        let data = res.data.result;
                        data.unshift({
                            type:'isHot',
                            typeDesc:'推荐'
                        })
                        this.menuDate.map(v=>{
                            for(let i=0; i<data.length ; i++){
                                if(v.title == data[i].typeDesc){
                                    v.type = data[i].type;
                                    break ; 
                                }
                            }
                        })
                         let type = this.menuDate[this.index].type;
                        
                        this.getItemsbyType(type);
                       
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

            //根据类型获取商品
            getItemsbyType(type ){

                let params = {
                    appkey:this.appkey,
                }
                if(type == 'isHot'){

                    params.key = 'isHot';
                    params.value = 1 ;
                }else{
                    params.key = 'type';
                    params.value = type;
                }


                 this.axios({

                    //请求方式
                    method: 'GET',
                    url: this.baseUrl + '/typeProducts',
                    params
                }).then(res => {
                    // console.log('res getItemsbyType==>',res)

                    this.$toast.clear();

                    if(res.data.code == 700){

                        this.$toast({
                            message:res.data.msg,
                            forbidClick:true,
                            duration:1000
                        });
                        return this.$router.push({name:'Login'});
                    }

                    if(res.data.code == 500 ){
                        this.ProductData = res.data.result;

                    }

                        // console.log('this.ProductData==>',this.ProductData);
                        
                }).catch(err => {
                    // this.$toast({
                    //         message: res.data.msg,
                    //         forbidClick: true,
                    //         duration: 1000
                    //     })
                });
            },

             // 传递id
            detailsDate(pid){
                this.$router.push({name:'Details', params:{pid}});
            },
        },
    }
</script>