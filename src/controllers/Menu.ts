import {Controller, Params, Param, Request, RequestMapping, BaseController, Body,} from "koa-msc";
import {MenuService} from "@/services/Menu";
import {Menu} from "@/models/Menu";
import {Pagination, success} from "@/utils";

@Controller('/route')
export class MenuController extends BaseController<MenuService> {
    @RequestMapping('/list', [Request.get, Request.post])
    @Params({
        pageNum: {type: "number"},
        pageSize: {type: 'number'}
    })
    async getMenuList(pagination: Pagination, condition) {
        return success(await this.service.pagination(condition, pagination.pageNum, pagination.pageSize))
    }

    @RequestMapping('/info', Request.get)
    @Param('id', {type: "string", required: true})
    async info({id}) {
        return success(await this.service.info({id: Number(id)}))
    }

    @RequestMapping('/add', Request.post)
    @Body({
        name: {type: "string", required: true}
    })
    async add(_, routeInfo: Omit<Menu, 'id'>, ctx) {
        routeInfo['creatorId'] = ctx.state.user.id
        await this.service.add(routeInfo)
        return success(true,'添加菜单成功')
    }

    @RequestMapping('/bind', Request.post)
    @Param('id', {type: "number"})
    @Body({
        apiIds: {type: "array", defaultField: {type: "number"}},
        roleIds: {type: "array", defaultField: {type: "number"}}
    })
    async bindUser(condition:Pick<Menu, 'id'>,{apiIds = [], roleIds = []}) {
        const route = await this.service.info(condition)
        const roles = await this.services.route.list({id: roleIds})
        const apis = await this.services.api.list({id: apiIds})
        await route['setRoles'](roles)
        await route['setApis'](apis)
        return success(true,'绑定成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Param('id',{required:true})
    async delete(condition:Pick<Menu, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除菜单成功')
    }
}