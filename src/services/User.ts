import {Service} from "koa-msc";
import {ModelStatic,Model} from 'sequelize'
import {User} from "@/models/User";

@Service
export class UserService{
    public model:ModelStatic<Model<User>>
    public models:Record<string, ModelStatic<Model>>
    getUserList(condition){
        return this.model.findAll({
            attributes:['id','name','age','email'],
            where:condition
        })
    }
    getInfo(condition:{id?:number,name?:string}){
        return this.model.findOne({
            attributes:['id','name','age','email'],
            where:condition,
            include:[
                {
                    model:this.models.role,
                    as:'roles',
                    through:{
                        attributes:[]
                    }
                },{
                    model:this.model,
                    as:'creator',
                    attributes:['id','name','age','email']
                }
            ]
        })
    }
    getInfoWithPwd(condition:{id?:number,name?:string}){
        return this.model.findOne({
            attributes:['id','name','age','email','password'],
            where:condition
        })
    }
    add(userInfo:User){
        return this.model.create(userInfo)
    }
}