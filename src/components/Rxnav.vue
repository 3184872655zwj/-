<template>
    <div class="rxnav">
        <van-nav-bar >
            <template #right>
                <div class="right-title" @click="goPage">
                先逛一逛
                </div>
            </template>
           
        </van-nav-bar>
    </div>
</template>

<script>
import '../assets/less/rxnav.less'
    export default {
        name:'Rxnav',
        methods:{
            goPage(){
                this.$router.push({name: 'Home'});
            }
        }
    }
</script>
