package cn.bike.yobike.service;

import java.util.List;
import java.util.Date;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import cn.bike.yobike.domain.Record;

@Service
public class RideService<T> {

	@Autowired
	JdbcTemplate jdbcTemplate;
	
	@Autowired
	UserService userService;
	
	public void addRide(String bike_id, String user_id, long start_time, long end_time){
		String sql = String.format("insert into charge (user_id,bike_id,start_time,end_time,price) values (?,?,?,?,?)");
		int update = jdbcTemplate.update(sql, bike_id, user_id, start_time, end_time, (end_time-start_time)/600.0 * 1);
	}

	  
	@SuppressWarnings("unchecked")
	public List<Record> showRide(String user_id) {
		return  jdbcTemplate.query("select * from record where user_id = ?", new Object[]{user_id}, new BeanPropertyRowMapper<Record>(Record.class));
	}
}
