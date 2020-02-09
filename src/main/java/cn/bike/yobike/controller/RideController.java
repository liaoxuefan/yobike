package cn.bike.yobike.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import cn.bike.yobike.domain.Record;
import cn.bike.yobike.service.RideService;

@Controller
@RequestMapping("/ride")
public class RideController {
	@Autowired
	RideService rideService;
	
	@RequestMapping("/add")
	@ResponseBody
	public void add(String bike_id, String user_id, long start_time, long end_time){
		rideService.addRide(bike_id, user_id, start_time, end_time);
	}
	
	@RequestMapping("/show")
	@ResponseBody
	public List<Record> show(@RequestParam String user_id){
		return rideService.showRide(user_id);
	}
}
