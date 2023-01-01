import {Controller, Params,Param, Request, RequestMapping, BaseController, Body} from "koa-msc";
import {RoleService} from "@/services/Role";
import {Role} from "@/models/Role";
import {Pagination, success} from "@/utils";

@Controller('/role')
export class RoleController extends BaseController<RoleService>{
    @RequestMapping('/list',[Request.get,Request.post])
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getRoleList(pagination:Pagination,condition){
        return success(await this.service.pagination(condition,pagination.pageNum,pagination.pageSize))
    }
    @RequestMapping('/info',Request.get)
    @Param('id',{type:"string",required:true})
    async info({id}){
        return success(await this.service.info({id:Number(id)}))
    }
    @RequestMapping('/add',Request.post)
    @Body({
        name:{type:"string",required:true}
    })
    async add(_,roleInfo:Omit<Role, 'id'>,ctx){
        roleInfo['creatorId']=ctx.state.user.id
        await this.service.add(roleInfo)
        return success(true,'添加角色成功')
    }
    @RequestMapping('/update',Request.post)
    @Param('id',{required:true})
    @Body({
        name:{type:"string",required:true}
    })
    async update(condition:Pick<Role, 'id'>,roleInfo:Partial<Omit<Role, 'id'>>){
        await this.service.update(condition,roleInfo)
        return success(true,'保存角色成功')
    }
    @RequestMapping('/bind',Request.post)
    @Param('id',{type:"number"})
    @Body({
        userIds:{type:"array",defaultField:{type:"number"}},
        routeIds:{type:"array",defaultField:{type:"number"}}
    })
    async bindUser(condition:Pick<Role, 'id'>,{userIds=[],routeIds=[]}){
        const role=await this.service.info(condition)
        const routes=await this.services.route.list({id:routeIds})
        const users=await this.services.user.list({id:userIds})
        await role['setMenus'](routes)
        await role['setUsers'](users)
        return success(true,'绑定成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Param('id',{required:true})
    async delete(condition:Pick<Role, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除角色成功')
    }
}