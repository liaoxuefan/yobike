package cn.bike.yobike.annotation;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.mapping.event.AbstractMongoEventListener;
import org.springframework.data.mongodb.core.mapping.event.BeforeConvertEvent;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Component;
import org.springframework.util.ReflectionUtils;
 
/**
 * @作者：刘时明
 * @时间：2019/3/17-11:35
 * @说明：保存监听器
 */
@Component
public class SaveMongoEventListener extends AbstractMongoEventListener<Object>
{
    @Autowired
    private MongoTemplate mongoTemplate;
 
    /**
     * onBefore代表前置处理
     * @param event
     */
    @Override
    public void onBeforeConvert(BeforeConvertEvent<Object> event)
    {
        Object source = event.getSource();
        if (source != null)
        {
            // 当写一个字段的时候触发回调
            ReflectionUtils.doWithFields(source.getClass(),(field)->
            {
                // 使用反射设置字段可以改变
                ReflectionUtils.makeAccessible(field);
                // 判断是否有自增标识
                if(field.isAnnotationPresent(GeneratedValue.class))
                {
                    field.set(source,getNextId(source.getClass().getSimpleName()));
                }
            });
        }
    }
 
    /**
     * 给定集合名，将之中的seqId自增一次，并返回
     * @param collName
     * @return
     */
    private long getNextId(String collName)
    {
        Query query = new Query(Criteria.where("collName").is(collName));
        Update update = new Update();
        update.inc("seqId", 1);
        // findAndModify是原子操作，避免并发问题
        FindAndModifyOptions options = new FindAndModifyOptions();
        options.upsert(true);
        options.returnNew(true);
        SequenceID seqId = mongoTemplate.findAndModify(query, update, options, SequenceID.class);
        return seqId.getSeqId();
    }
}
