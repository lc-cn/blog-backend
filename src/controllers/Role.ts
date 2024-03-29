import {Controller, Params, Param, Request, RequestMapping, BaseController, Body, Describe, Tag} from "koa-msc";
import {RoleService} from "@/services/Role";
import {Role} from "@/models/Role";
import {AppErr, Pagination, success} from "@/utils";

@Controller('/role','角色管理')
export class RoleController extends BaseController<RoleService>{
    @RequestMapping('/list',[Request.get,Request.post])
    @Describe('获取角色列表')
    @Tag('角色','列表')
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getRoleList(pagination:Pagination,condition){
        return success(await this.service.pagination(condition,pagination.pageNum,pagination.pageSize))
    }
    @RequestMapping('/info',Request.get)
    @Describe('获取角色详情')
    @Tag('角色','详情')
    @Param('id',{type: "number"})
    async info({id}){
        return success(await this.service.info({id:Number(id)},{
            rejectOnEmpty:false,
            include:[
                {
                    model:this.service.models.user,
                    as:'users',
                    attributes:['id','username'],
                    through:{attributes:[]}
                },
                {
                    model:this.service.models.menu,
                    attributes:['id'],
                    as:'menus',
                    through:{attributes:[]}
                }
            ]
        }))
    }
    @RequestMapping('/add',Request.post)
    @Describe('添加角色')
    @Tag('角色','添加')
    @Body({
        name:{type:"string",required:true}
    })
    async add(_,roleInfo:Omit<Role, 'id'>,ctx){
        roleInfo['creatorId']=ctx.state.user.id
        await this.service.add(roleInfo)
        return success(true,'添加角色成功')
    }
    @RequestMapping('/update',Request.post)
    @Describe('保存角色')
    @Tag('角色','保存')
    @Param('id',{type: "number"})
    @Body({
        name:{type:"string",required:true}
    })
    async update(condition:Pick<Role, 'id'>,roleInfo:Partial<Omit<Role, 'id'>>){
        await this.service.update(condition,roleInfo)
        return success(true,'保存角色成功')
    }
    @RequestMapping('/bind',Request.post)
    @Describe('绑定角色权限')
    @Tag('角色','绑定权限')
    @Param('id',{type: "number"})
    @Body({
        userIds:{type:"array",defaultField:{type:"number"}},
        routeIds:{type:"array",defaultField:{type:"number"}}
    })
    async bind(condition:Pick<Role, 'id'>,{userIds,menuIds}:{userIds?:number[],menuIds?:number[]}){
        const role=await this.service.info(condition)
        if(!userIds && !menuIds) return new AppErr('请至少配置一项',416)
        if(menuIds){
            const menus=await this.services.menu.list({id:menuIds})
            await role['setMenus'](menus)
        }
        if(userIds){
            const users=await this.services.user.list({id:userIds})
            await role['setUsers'](users)
        }
        return success(true,'绑定成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Describe('删除角色')
    @Tag('角色','删除')
    @Param('id',{type: "number"})
    async delete(condition:Pick<Role, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除角色成功')
    }
}