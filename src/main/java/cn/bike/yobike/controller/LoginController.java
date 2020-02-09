package cn.bike.yobike.controller;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.alibaba.fastjson.JSONObject;

import cn.bike.yobike.domain.User;
import cn.bike.yobike.service.UserService;

@Controller
public class LoginController {
	
	@Autowired
	UserService userService;
	
	//f53ccc1aecf11c6dc8d1e83646ae3076
	@RequestMapping("/login")
	@ResponseBody
	public String login(String code){
		URI uri = UriComponentsBuilder.fromHttpUrl("https://api.weixin.qq.com/sns/jscode2session")
                .queryParam("appid","wx7ca98de5870739ac")
                .queryParam("secret","f53ccc1aecf11c6dc8d1e83646ae3076")
                .queryParam("js_code",code)
                .queryParam("grant_type","authorization_code")
                .build().encode().toUri();
        RestTemplate restTemplate=new RestTemplate();
        String json=restTemplate.getForObject(uri,String.class);
        JSONObject obj = JSONObject.parseObject(json);
        String openid = obj.getString("openid");
        //生成新用户
        User user = userService.getByToken(openid);
        if(user == null){
        	userService.addUser(openid);
        }
		return openid;
	}
}
