package cn.bike.yobike.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import cn.bike.yobike.domain.Bike;
import cn.bike.yobike.service.BikeService;

@Controller
public class BikeController {
	
	@Autowired
	BikeService bikeService;

	@ResponseBody
	@RequestMapping("/bike/trouble")
	public String bike(String picUrls, String inputValue, String checkboxValue, String openid, double x, double y){
		
		boolean isTro = false;
		
		JSONObject obj = JSONObject.parseObject(inputValue);
        long num = obj.getLongValue("num");
        //是否勾选车牌缺损
        StringBuilder trouble = new StringBuilder();
        JSONArray array = JSONArray.parseArray(checkboxValue);
        for (int j = 0; j < array.size(); j++) {
        	String str = array.getString(j);
        	trouble.append(str+" ");
        	if(str.equals("车牌缺损")){
        		isTro = true;
        	}
        }
        Bike bike = null;
        if(!isTro){//没有缺损
        	if(num == 0){
        		return "请输入单车编号";
        	}else{
        		bike = bikeService.getBikeById(num);
        		if(bike == null){
        			bike = new Bike();
        			bike.setLocation(new Double[]{x,y});
        		}
        	}
        }else{
        	if(num == 0){
        		bike = new Bike();
    			bike.setLocation(new Double[]{x,y});
        	}else{
        		bike = bikeService.getBikeById(num);
        		if(bike == null){
        			bike = new Bike();
        			bike.setLocation(new Double[]{x,y});
        		}
        	}
        }
        
        if(bike.getIsShow() != null && bike.getIsShow() == 1){
        	return "单车正在使用中";
        }
        
        bikeService.createTroubleRecord(bike, openid, picUrls, obj.getString("desc"), trouble.toString());
        
        
        return "提交成功";
	}
	
	
}
