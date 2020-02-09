package cn.bike.yobike.service;

import java.util.Date;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.mongodb.WriteResult;

import cn.bike.yobike.domain.User;

@Service
public class UserService {
	@Autowired
	MongoTemplate mongoTemplate;
	
	@Autowired
	JdbcTemplate jdbcTemplate;

	public User getByToken(String openid) {
		return mongoTemplate.findOne(new Query(Criteria.where("openid").is(openid)), User.class);
	}
	
	public void addUser(String openid){
		User user = new User();
		user.setCreateTime(new Date());
		user.setGuarantee(0.0);
		user.setOpenid(openid);
		user.setBalance(0.0);
		mongoTemplate.save(user);
	}
	
	@Transactional(rollbackFor=Exception.class)
	public void pay(int type,User user,double price) throws Exception{
		Query query = new Query(); 
	    query.addCriteria(Criteria.where("id").is(user.getId()));
	    WriteResult upsert = null;
		if(type == 1){
			price += user.getBalance();
			
		    Update update = Update.update("balance", price);
		    upsert = mongoTemplate.updateFirst(query, update, User.class);
		}else{
			Update update = Update.update("guarantee", 99);
			upsert = mongoTemplate.updateFirst(query, update, User.class);
		}
		String sql = String.format("insert into charge (user_id,price,type,create_time) values (?,?,?,?)");
		int update = jdbcTemplate.update(sql, user.getId(), price, type, new Date());
		

	}

	public boolean refund(String openid) {
		Query query = new Query(); 
	    query.addCriteria(Criteria.where("openid").is(openid));
	    Update update = Update.update("guarantee", 0);
	    WriteResult upsert = mongoTemplate.updateFirst(query, update, User.class);
	    return upsert.getN() == 1;       //返回执行的条数
	}
	
	

}
