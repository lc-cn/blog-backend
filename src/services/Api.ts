import {Service} from "koa-msc";
import {ModelStatic,Model} from 'sequelize'
import {Api} from "@/models/Api";

@Service
export class ApiService{
    public model:ModelStatic<Model<Api>>
    public models:Record<string, ModelStatic<Model>>
    getApiList(condition){
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
                    model:this.models.role,
                },
            ]
        })
    }
    add(apiInfo:Api){
        return this.model.create(apiInfo)
    }
}