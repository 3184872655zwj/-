import { Toast } from 'vant';//导入提示组件

class Utils {

  //验证表单
  validForm(o) {
    //验证表单的数据, object
    for (let key in o) {
        //判断手机号、密码、昵称是否正解
      if (!o[key].reg.test(o[key].value)) {
        //提示
        Toast({
          message: o[key].errorMsg,
          duration: 3000,//提示3秒
          forbidClick: true,//提示期间无法点击页面
        });
        return false;
      }
    }

    //表单验证通过
    return true;
  }

}

// 对外开放自己
export const utils = new Utils();