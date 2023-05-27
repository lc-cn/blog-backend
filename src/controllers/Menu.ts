import {BaseController, Body, Controller, Describe, Param, Params, Request, RequestMapping, Tag,} from "koa-msc";
import {MenuService} from "@/services/Menu";
import {Menu} from "@/models/Menu";
import {AppErr, Pagination, success, toTree} from "@/utils";

@Controller('/menu', '菜单管理')
export class MenuController extends BaseController<MenuService> {
    @RequestMapping('/tree',[Request.get])
    @Describe('获取菜单树')
    @Tag('菜单','树形结构')
    @Param('pId',{type: "number"})
    async getMenuTree({pId=null}:Pick<Menu, 'pId'>,_,ctx){
        const menus=await this.service.list({pId:pId})
        if(!menus.length) return success([])
        return success(await Promise.all(menus.map(async item=>toTree(item))))
    }
    @RequestMapping('/list', [Request.post])
    @Describe('获取菜单列表')
    @Tag('菜单','列表')
    @Params({
        pageNum: {type: "number"},
        pageSize: {type: 'number'}
    })
    async getMenuList(pagination: Pagination, condition) {
        return success(await this.service.pagination(condition, pagination.pageNum, pagination.pageSize))
    }

    @RequestMapping('/info', Request.get)
    @Describe('获取菜单详情')
    @Tag('菜单','详情')
    @Param('id', {type: "number"})
    async info({id}) {
        return success(await this.service.info({id: Number(id)},{
            rejectOnEmpty:false,
            include:[
                {
                    model:this.service.models.role,
                    attributes:['id'],
                    as:'roles',
                    through:{attributes:[]}
                },
                {
                    model:this.service.models.api,
                    attributes:['id'],
                    as:'apis',
                    through:{attributes:[]}
                }
            ]
        }))
    }

    @RequestMapping('/add', Request.post)
    @Describe('添加菜单')
    @Tag('菜单','添加')
    @Body({
        name: {type: "string", required: true}
    })
    async add(_, routeInfo: Omit<Menu, 'id'>, ctx) {
        routeInfo['creatorId'] = ctx.state.user.id
        routeInfo['menuId']=routeInfo.pId
        await this.service.add(routeInfo)
        return success(true,'添加菜单成功')
    }

    @RequestMapping('/bind', Request.post)
    @Describe('绑定菜单')
    @Tag('菜单','绑定')
    @Param('id',{type: "number"})
    @Body({
        apiIds: {type: "array", defaultField: {type: "number"}},
        roleIds: {type: "array", defaultField: {type: "number"}}
    })
    async bind(condition:Pick<Menu, 'id'>,{apiIds,roleIds}:{apiIds?:number[],roleIds?:number[]}){
        const menu=await this.service.info(condition)
        if(!apiIds && !roleIds) return new AppErr('请至少配置一项',416)
        if(apiIds){
            const apis=await this.services.api.list({id:apiIds})
            await menu['setApis'](apis)
        }
        if(roleIds){
            const roles=await this.services.role.list({id:roleIds})
            await menu['setRoles'](roles)
        }
        return success(true,'绑定成功')
    }
    @RequestMapping('/update',Request.put)
    @Describe('修改菜单')
    @Tag('菜单','修改')
    @Param('id',{type: "number"})
    @Body({
        name: {type: "string", required: true}
    })
    async update(condition:Pick<Menu, 'id'>,menuInfo:Partial<Omit<Menu, 'id'>>){
        menuInfo['menuId']=menuInfo.pId
        await this.service.update(condition,menuInfo)
        return success(true,'修改友链成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Describe('删除菜单')
    @Tag('菜单','删除')
    @Param('id',{type: "number"})
    async delete(condition:Pick<Menu, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除菜单成功')
    }
}