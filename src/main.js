import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
//注册vant组件
import { 
  NavBar ,
  Field  ,
  Button ,
  Popup ,
  Swipe, 
  SwipeItem,
  Search,
  Tabbar,
  TabbarItem,
  Toast,
  GoodsAction,
  GoodsActionIcon,
  GoodsActionButton ,
  Stepper ,
  SubmitBar ,
  RadioGroup,
  Radio ,
  CheckboxGroup ,
  Checkbox,
  AddressList ,
  SwipeCell,
  List ,
  AddressEdit ,
  Area ,
  Empty ,
  Icon ,
  Tab,
  Tabs ,
  Uploader ,
  Cell ,
  CellGroup ,
  Dialog 
  
  
} from 'vant';

// 将px转rem文件
import 'lib-flexible/flexible'

import axios from 'axios'
import VueAxios from 'vue-axios'
import VueCookies from 'vue-cookies'


Vue
  .use(NavBar )
  .use(Field )
  .use(Button )
  .use(Popup )
  .use(Swipe )
  .use(SwipeItem )
  .use(Search)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Toast)
  .use(GoodsAction)
  .use(GoodsActionIcon)
  .use(GoodsActionButton)
  .use(Stepper)
  .use(SubmitBar )
  .use(RadioGroup)
  .use(Radio)
  .use(CheckboxGroup )
  .use(Checkbox)
  .use(AddressList )
  .use(SwipeCell )
  .use(List )
  .use(AddressEdit )
  .use(Area )
  .use(Empty )
  .use(Icon )
  .use(Tab )
  .use(Tabs )
  .use(Uploader )
  .use( Cell)
  .use(CellGroup)
  .use(Dialog )

  // 添加请求拦截器
  axios.interceptors.request.use( config => {

  　　// 在发送请求之前做些什么
    if(config.method === 'post'){

      // 序列化psot请求参数
      let parent = '';
      for(let key in config.data){
        parent += `${key}=${config.data[key]}&`;
      }

      config.data = parent.slice(0,-1);
    }

  　　return config;

  })

  Vue.use(VueAxios, axios)
  Vue.use(VueCookies)



Vue.config.productionTip = false

//将请求路径和appkey存放在原型属性里
Vue.prototype.baseUrl = 'http://www.kangliuyong.com:10002'
Vue.prototype.appkey = 'U2FsdGVkX19WSQ59Cg+Fj9jNZPxRC5y0xB1iV06BeNA='

//全局过滤器
Vue.filter('formatDate' , (data , format)=> {

    let date = new Date(data); 

    //获取年份
    let year = date.getFullYear().toString();

    if(/(y+)/.test(format)){
      // 获取匹配组内容
      let yearContent = RegExp.$1;

      format = format.replace(yearContent , year.slice(year.length - yearContent.length));

    }

    //月、日、时、分、秒
    let dateObject = {
      M: date.getMonth()+1, 
      d: date.getDate(),
      h: date.getHours(),
      m: date.getMinutes(),
      s: date.getSeconds(),

    };

    for(let key in dateObject){
      //动态正则表达式
      let reg = new RegExp(`(${key}+)`);
      if(reg.test(format)) {
        let content = RegExp.$1;

        format = format.replace(content ,dateObject[key] >= 10? dateObject[key] : content.length == 2 ? "0" + dateObject[key] : dateObject[key]);

      }
    }

    return format;
})


new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
