import {Service} from "koa-msc";
import {ModelStatic,Model} from 'sequelize'
import {User} from "@/models/User";

@Service
export class UserService{
    public model:ModelStatic<Model<User>>
    public models:Record<string, ModelStatic<Model>>
    getUserList(condition){
        return this.model.findAll({
            attributes:['name','age','email'],
            where:condition
        })
    }
    getInfo({name}){
        return this.model.findOne({
            where:{name}
        })
    }
    add(userInfo:User){
        return this.model.create(userInfo)
    }
}