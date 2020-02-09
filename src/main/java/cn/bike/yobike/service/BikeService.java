package cn.bike.yobike.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.SQLException;
import java.sql.Statement;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cn.bike.yobike.domain.Bike;
import cn.bike.yobike.domain.TroubleRecord;

@Service
public class BikeService {

	@Autowired
	private MongoTemplate mongoTemplate;
	
	@Autowired
	private JdbcTemplate jdbcTemplate;
	
	@Autowired
	private UserService userService;

	public Bike getBikeById(String id) {
		Query query = new Query(Criteria.where("id").is(new ObjectId(id)));
		Bike bike = mongoTemplate.findOne(query, Bike.class);
		return bike;
	}

	public Bike getBikeById(long num) {
		// TODO 自动生成的方法存根
		return null;
	}
	
	@Transactional
	public void createTroubleRecord(Bike bike, String openid, String picUrls, String comment, String type){
		TroubleRecord record = new TroubleRecord();
		
		record.setUserId(Integer.valueOf(userService.getByToken(openid).getId().toString()));
		record.setBikeId(bike.getId() == null ? 0 : bike.getId().getTimestamp());
		record.setLongitude(bike.getLocation() == null ? "" : bike.getLocation()[0].toString());
		record.setLatitude(bike.getLocation() == null ? "" : bike.getLocation()[1].toString());
		record.setImg(picUrls);
		record.setRemark(comment); 
		record.setType(type);
		
		String sql = "insert into trouble_record(user_id,bike_id,longitude,latitude,img,remark,type) "
				+ "values(?,?,?,?,?,?,?)";
        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(new PreparedStatementCreator() {
            @Override
            public PreparedStatement createPreparedStatement(Connection connection) throws SQLException {
                PreparedStatement ps = connection.prepareStatement(sql,Statement.RETURN_GENERATED_KEYS);
                ps.setInt(1, record.getUserId());
                ps.setInt(2, record.getBikeId());
                ps.setString(3, record.getLongitude());
                ps.setString(4, record.getLatitude());
                ps.setString(5, record.getImg());
                ps.setString(6, record.getRemark());
                ps.setString(7, record.getType());
                return ps;
            }
        }, keyHolder);
        System.out.print(keyHolder.getKey().intValue());
		
	}
	
	
}
