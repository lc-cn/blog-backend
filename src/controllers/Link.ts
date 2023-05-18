import {Controller, Params,Param, Request, RequestMapping, BaseController, Body} from "koa-msc";
import {LinkService} from "@/services/Link";
import {Link} from "@/models/Link";
import {Pagination, success} from "@/utils";

@Controller('/link')
export class LinkController extends BaseController<LinkService>{
    @RequestMapping('/list',[Request.get,Request.post])
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getLinkList(pagination:Pagination,condition){
        return success(await this.service.pagination(condition,pagination.pageNum,pagination.pageSize))
    }
    @RequestMapping('/info',Request.get)
    @Param('id',{type: "number"})
    async info({id}){
        return success(await this.service.info({id:Number(id)}))
    }
    @RequestMapping('/add',Request.post)
    @Body({
        icon:{type:"string",required:true},
        name:{type:"string",required:true},
        desc:{type:"string",required:true},
        url:{type:"string",required:true},
    })
    async add(_,linkInfo:Omit<Link, 'id'>,ctx){
        linkInfo['creatorId']=ctx.state.user.id
        await this.service.add(linkInfo)
        return success(true,'添加友链成功')
    }
    @RequestMapping('/update',Request.put)
    @Param('id',{type: "number"})
    @Body({
        icon:{type:"string"},
        name:{type:"string"},
        desc:{type:"string"},
        url:{type:"string"},
    })
    async update(condition:Pick<Link, 'id'>,linkInfo:Partial<Omit<Link, 'id'>>){
        await this.service.update(condition,linkInfo)
        return success(true,'修改友链成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Param('id',{type: "number"})
    async delete(condition:Pick<Link, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除友链成功')
    }
}