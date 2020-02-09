package cn.bike.yobike.annotation;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.mapping.Field;
 

/*
 * 保存每个集合最近一次的ID
 */
@Document(collection = "sequence")
public class SequenceID
{
    @Id
    private String id;
    @Field("seq_id")
    private long seqId;
    @Field("coll_name")
    private String collName;
 
    public String getId()
    {
        return id;
    }
 
    public void setId(String id)
    {
        this.id = id;
    }
 
    public long getSeqId()
    {
        return seqId;
    }
 
    public void setSeqId(long seqId)
    {
        this.seqId = seqId;
    }
 
    public String getCollName()
    {
        return collName;
    }
 
    public void setCollName(String collName)
    {
        this.collName = collName;
    }
    
}


