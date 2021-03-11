<template>
    <div class="paychild">
        <div>
            <slot name="pay-title">
                <div class="pay-title">订单信息</div>
            </slot>
        </div>
        <!-- 结算商品 -->
       <div class="middle">
          <slot name="article">
              
          </slot>
       </div>
       <!-- 分割线 -->
       <div class="foot">
           <div class="foot-line">
               <div></div>
               <div></div>
           </div>
           <div class="total-box">
               <div class="time" v-if="proInfo.data">
                  {{proInfo.data | formatDate('yyyy-MM-dd hh:mm:ss')}}
                </div>
               <div class="account-box">
                   <div>共计  {{proInfo.total}} 件</div>
                   <div class="footing">合计 ￥ {{proInfo.count}}</div>
               </div>
           </div>
       </div>
    </div>
</template>

<script>
import '../assets/less/paychild.less'
    export default {
        name:"Paychild",
        props:{
            proInfo:{
                type:Object,
                default(){
                    return {
                        count:0,
                        total:0,
                        data:''
                    }
                }
            },

        }
        
    }
</script>

