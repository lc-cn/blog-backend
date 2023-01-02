import {BaseService, Service} from "koa-msc";
import {User} from "@/models/User";
@Service
export class UserService extends BaseService<User>{
    override info(condition:{id?:number,username?:string}){
        return this.model.findOne({
            attributes:['id','username','nickname','age','email'],
            where:condition,
            include:[
                {
                    model:this.models.role,
                    as:'roles',
                    attributes:['id','name'],
                    include:[
                        {
                            model:this.models.menu,
                            attributes:['id','pId','name','type','path','component','icon'],
                            as:'menus',
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
                    attributes:['id','username']
                }
            ]
        })
    }
    getInfoWithPwd(condition:{id?:number,username?:string}){
        return this.model.findOne({
            attributes:['id','username','age','email','password'],
            where:condition
        })
    }
}