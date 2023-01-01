import {BaseService, Service} from "koa-msc";
import {User} from "@/models/User";
@Service
export class UserService extends BaseService<User>{
    getUserList(condition){
        return this.model.findAll({
            attributes:['id','name','age','email'],
            where:condition
        })
    }
    override info(condition:{id?:number,name?:string}){
        return this.model.findOne({
            attributes:['id','name','age','email'],
            where:condition,
            include:[
                {
                    model:this.models.role,
                    as:'roles',
                    attributes:['id','name'],
                    include:[
                        {
                            model:this.models.route,
                            attributes:['id','pId','name','type','path','component','icon'],
                            as:'routes',
                            through:{attributes:[]},
                            include:[
                                {
                                    model:this.models.api,
                                    attributes:['id','url','methods'],
                                    as:'apis',
                                    through:{
                                        attributes:[]
                                    }
                                },
                            ]
                        }
                    ],
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
}