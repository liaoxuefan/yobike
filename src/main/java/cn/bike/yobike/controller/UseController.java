package cn.bike.yobike.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSON;

import cn.bike.yobike.domain.Bike;
import cn.bike.yobike.domain.User;
import cn.bike.yobike.service.BikeService;
import cn.bike.yobike.service.UserService;


@Controller
public class UseController {
	@Autowired
	UserService userService;
	@Autowired
	BikeService bikeService;
	
	@ResponseBody
	@RequestMapping("/use")
	public String useBike(@CookieValue("openid") String openid){
		/*if(StringUtils.isEmpty(openid)){
			throw new TokenException();
		}*/
		User user = userService.getByToken(openid);
		if(user == null || user.getGuarantee() == null){
//			throw new DepositException();
			return "未交押金";
		}
		return "success";
	}
	
	@RequestMapping("/scan")
	@ResponseBody
	public String scanBike(@RequestParam("id") String id){
		Bike bike = bikeService.getBikeById(id);
		if(bike == null){
			return "二维码错误";
		}
		if(bike.getIsShow() == 1){
			return "此单车正在被使用";
		}
		if(bike.getType() == 1){
			return "此单车被保修，暂不可使用";
		}
		return JSON.toJSONString(bike);
		
	}
}
