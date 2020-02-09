package cn.bike.yobike.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.bike.yobike.domain.User;
import cn.bike.yobike.service.UserService;

@Controller
@RequestMapping("/user")
public class UserController {
	@Autowired
	UserService userService;

	@ResponseBody
	@RequestMapping("/recharge")
	public String pay(@CookieValue("openid") String openid, int from, double price){
		int type = 1;
		//0为钱包页面余额，1为支付页面余额
		if(from == 0 || from == 1){
			type = 1;
		//2为钱包页面押金，3为首页押金
		}else if(from == 2 || from == 3){
			type = 0;
		}
		if(type == 0 && price != 99){
			return "充值失败：请输入99";
		}
		User user = userService.getByToken(openid);
		try {
			userService.pay(type, user, price);
		} catch (Exception e) {
			return "充值失败";
		}
		
		return "充值成功";
	}
	
	@ResponseBody
	@RequestMapping
	public User getUser(@CookieValue("openid") String openid){
		return userService.getByToken(openid);
	}
	
	@ResponseBody
	@RequestMapping("/refund")
	public String refund(@CookieValue("openid") String openid){
		if(!userService.refund(openid)){
			return "退款失败";
		}
		return "退款成功";
	}
}
