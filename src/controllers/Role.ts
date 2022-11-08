import {App, Controller, pagination, Params,Param, Request, RequestMapping,} from "koa-msc";
import {config} from "dotenv";
import {RoleService} from "@/services/Role";
import {Role} from "@/models/Role";

const {parsed:env}=config({path:'.env'})
@Controller('/role')
export class RoleController{
    constructor(public app:App,public service:RoleService,public services) {
    }
    @RequestMapping('/list',[Request.get,Request.post])
    async getUserList(condition){
        return pagination(await this.service.getRoleList(condition),1,10)
    }
    @RequestMapping('/info',Request.get)
    @Param('id',{type:"string",required:true})
    async info({id}){
        return this.service.getInfo({id:Number(id)})
    }
    @RequestMapping('/add',Request.post)
    @Params({
        name:{type:"string",required:true}
    })
    async add(roleInfo:Role,ctx){
        roleInfo['creatorId']=ctx.state.user.id
        return await this.service.add(roleInfo)
    }
    @RequestMapping('/bind',Request.post)
    @Param('id',{type:"number"})
    @Param('userIds',{type:"array",defaultField:{type:"number"}})
    @Param('apiIds',{type:"array",defaultField:{type:"number"}})
    async bindUser({id,userIds=[],apiIds=[]},ctx){
        const role=await this.service.getInfo({id})
        const apis=await this.services.api.getApiList({id:apiIds})
        const users=await this.services.user.getUserList({id:userIds})
        await role['setApis'](apis)
        await role['setUsers'](users)
        return '绑定成功'
    }

}