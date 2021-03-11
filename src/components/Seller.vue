<template>
    <div class="seller">
            <div v-for="(n ,k) in bestldata" :key="k" class="article" @click="detailsDate(n.pid)">
                <div class="sellerBottom">热卖</div>
                <div class="imgBox">
                    <img :src="n.smallImg" />
                </div>
                <div class="seller_name">{{n.name}}</div>
                <div class="seller_nameII">{{n.enname}}</div>
                <div class="priceBox">
                    <span class="price">￥{{n.price}}</span>
                    <span class="delete">
                        <slot></slot>
                    </span>
                </div>
            </div>
    </div>
</template>

<script>
import '../assets/less/Seller.less'

    export default {
        name:'Seller',

        props: ['bestldata'],
        
        methods:{
            //跳转商品详情
            detailsDate(pid){
                // console.log('pid=>',pid);
                 this.$nextTick(function(){
                    // console.log(this.bestldata);
                })
                this.$router.push({name:'Details', params:{pid}});
               
            }
        }
    }
</script>

