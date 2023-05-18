import {Controller,Param, Request, RequestMapping, BaseController, Body} from "koa-msc";
import {ApiService} from "@/services/Api";
import {Api} from "@/models/Api";
import { success} from "@/utils";

@Controller('/api')
export class ApiController extends BaseController<ApiService>{
    @RequestMapping('/list',[Request.post])
    @Body({
        group:{type:"string"},
        methods:{type:'array',defaultField:{type:"string"}},
        tags:{type:'array',defaultField:{type:"string"}}
    })
    async getApiList(pagination,condition:Pick<Api, 'group'|'methods'|'tags'>){
        return success(await this.service.pagination(condition, pagination.pageNum, pagination.pageSize))
    }
    @RequestMapping('/info',Request.get)
    @Param('id',{type: "number"})
    async info({id}){
        return success(await this.service.info({id:Number(id)}))
    }
    @RequestMapping('/add',Request.post)
    @Body({
        name:{type:"string",required:true}
    })
    async add(_,apiInfo:Omit<Api, 'id'>,ctx){
        apiInfo['creatorId']=ctx.state.user.id
        await this.service.add(apiInfo)
        return success(true,'添加接口成功')
    }
    @RequestMapping('/bindMenu',Request.post)
    @Param('id',{type: "number"})
    @Body({
        'ids':{type:"array",defaultField:{type:"number"}}
    })
    async bindMenu({id},{ids}){
        const api=await this.service.info({id})
        const menus=await this.services.menu.list({id:ids})
        await api['setMenus'](menus)
        return success(true,'绑定成功')
    }
    @RequestMapping('/update',Request.put)
    @Param('id',{type: "number"})
    @Body({
        name:{type:"string",required:true}
    })
    async update(condition:Pick<Api, 'id'>,apiInfo:Partial<Omit<Api, 'id'>>){
        await this.service.update(condition,apiInfo)
        return success(true,'修改接口成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Param('id',{type: "number"})
    async delete(condition:Pick<Api, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除接口成功')
    }
}