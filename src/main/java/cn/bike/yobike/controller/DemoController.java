package cn.bike.yobike.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.GeoResult;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;


import cn.bike.yobike.domain.Bike;
import cn.bike.yobike.service.DemoService;

@Controller
public class DemoController {
	
	@Autowired
	private DemoService demoService;
	
	@ResponseBody
	@RequestMapping("/")
	public String hello(){
		return "hello,yobike!";
	}
	
	@ResponseBody
	@RequestMapping("/bike/add")
	public void addBike(@RequestBody Bike bike){
		demoService.addBike(bike);
	}
	
	@ResponseBody
	@RequestMapping("/bike/show")
	public List<Bike> showBike(){
		return demoService.showBike();
	}
	
	@ResponseBody
	@RequestMapping("/bike/showNear")
	public List<Bike> showNearBike(double x, double y){
		return demoService.showNearBike(x,y);
	}
	
	@ResponseBody
	@RequestMapping("/bike/change")
	public boolean changeBike(@RequestParam int tp,@RequestParam String id){
		String key = "";
		int val = 0;
		if(tp == 0){
			key = "isShow";
			val = 1;
		}else if(tp == 1){
			key = "isShow";
			val = 0;
		}else if(tp == 2){
			key = "type";
			val = 1;
		}else if(tp == 3){
			key = "type";
			val = 0;
		}
		
		return demoService.changeBike(key, val, id);
	}
	
	
}
