import {Service} from "koa-msc";
import {ModelStatic,Model} from 'sequelize'
import {Role} from "@/models/Role";

@Service
export class RoleService{
    public model:ModelStatic<Model<Role>>
    public models:Record<string, ModelStatic<Model>>
    getRoleList(condition){
        return this.model.findAll({
            attributes:['id','name'],
            where:condition
        })
    }
    getInfo(condition:{id?:number,name?:string}){
        return this.model.findOne({
            attributes:['id','name'],
            where:condition,
            include:[
                {
                    model:this.models.user,
                    as:'creator',
                    attributes:['id','name','age','email']
                },
                {
                    model:this.models.user,
                    as:'users',
                    attributes:['id','name','age','email'],
                    through:{attributes:[]}
                },
                {
                    model:this.models.api,
                    as:'permissions',
                    attributes:['id','url','methods','rules']
                }
            ]
        })
    }
    add(roleInfo:Role){
        return this.model.create(roleInfo)
    }
}