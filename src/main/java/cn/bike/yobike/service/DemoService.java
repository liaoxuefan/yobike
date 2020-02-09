package cn.bike.yobike.service;

import java.util.List;

import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.geo.GeoResult;
import org.springframework.data.geo.GeoResults;
import org.springframework.data.geo.Metrics;
import org.springframework.data.geo.Point;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.NearQuery;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;

import com.mongodb.WriteResult;

import cn.bike.yobike.domain.Bike;


@Service
public class DemoService {

	@Autowired
	private MongoTemplate mongoTemplate;
	
	public void addBike(Bike bike) {
		mongoTemplate.insert(bike);
	}

	public List<Bike> showBike() {
		return mongoTemplate.findAll(Bike.class);
	}

	public List<Bike> showNearBike(double x, double y) {
		
//		NearQuery nearQuery = NearQuery.near(x, y);
//		//指定范围和距离单位
//		nearQuery.spherical(true).maxDistance(0.5, Metrics.KILOMETERS);
//		GeoResults<Bike> results = mongoTemplate.geoNear(nearQuery,Bike.class);
//		return results.getContent();
//		//.query(new Query(Criteria.where("type").is(0)).limit(20))
		Query query = new Query(Criteria.where("location").nearSphere(new Point(x, y)).maxDistance(0.000025).minDistance(0));
		List<Bike> list = mongoTemplate.find(query, Bike.class);
		return list;
	}

	public boolean changeBike(String key,int val, String id) {
		Query query = new Query(); 
	    query.addCriteria(Criteria.where("id").is(new ObjectId(id)));
	    Update update = Update.update(key, val);
	    WriteResult upsert = mongoTemplate.updateFirst(query, update, Bike.class);
	    
		return upsert.getN() == 1;
	}
}
