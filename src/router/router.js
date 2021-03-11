// Main组件的二级路由
const MainRouets = [
  {
    path: '/home',
    alias: '/',
    name: 'Home', 
    component: () => import('../views/Home.vue')
  },
  {
    path: '/menu',
    name: 'Menu',
    component: () => import('../views/Menu.vue')
  },
  {
    path: '/shopbag',
    name: 'Shopbag',
    component: () => import('../views/Shopbag.vue')
  },
  {
    path: '/my',
    name: 'My',
    component: () => import('../views/My.vue')
  }
];

export  const routes = [
    {
      path: '/',
      name: 'Main',
      component:()=> import('../views/Main.vue'),
      //二级路由
      children: MainRouets
    },
    // 登录页面
    {
      path:'/login',
      name:'Login',
      component:()=> import('../views/Login.vue')
    },
    // 商品详情页面
    {
      path:'/details/:pid',
      name:'Details',
      component:()=> import('../views/Details.vue')
    },
    // 地址管理
   
    {
      path:'/address',
      name:'Address',
      component:()=> import('../views/Address.vue')
    },
     //增加新的地址
    {
      //:aid? 可有可无
      path:'/newaddress/:aid?',
      name:'Newaddress',
      component:()=> import('../views/Newaddress.vue')
    },
    // 菜单
    {
      path:'/Menu',
      name:'Menu',
      component:()=> import('../views/Menu.vue')
    },
    // 支付
    {
      path:'/pay',
      name:'Pay',
      component:()=> import('../views/Pay.vue')
    },
    // 订单
    {
      path:'/order',
      name:'Order',
      component:()=> import('../views/Order.vue')
    },
    // 搜索
    {
      path:'/search',
      name:'Search',
      component:()=> import('../views/Search.vue')
    },
    // 个人资料
    {
      path:'/personal',
      name:'Personal',
      component:()=> import('../views/Personal.vue')
    },
    // 我的收藏
    {
      path:'/collect',
      name:'Collect',
      component:()=> import('../views/Collect.vue')
    },
    // 安全中心
    {
      path:'/center',
      name:'Center',
      component:()=> import('../views/Center.vue')
    }
]