<template>
    <div class="clearinggoods">
        <div class="img-box">
            <img :src="product.small_img"/>
        </div>
        <div class="name-box">
            <div class="name-top">
                <div class="names">
                    {{product.name}}
                </div>
                <div class="dosing">
                    {{product.rule}}
                </div>
            </div>
            <div class="en-name">
                {{product.enname}}
            </div>
            <div class=" price-box">
                <div class="price">
                    ￥{{product.price}}
                </div>
                <div class="num">
                    <span>x</span>
                    <span>
                        {{product.count}}
                    </span>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import '../assets/less/Clearinggoods.less'
    export default {
        name:'Clearinggoods',
        props:{
            product:{
                type:Object,
                //当前props 为引用类型属性，默认值必须使用default 函数返回
                default(){
                    return {};
                }
            }
        }
    }
</script>

