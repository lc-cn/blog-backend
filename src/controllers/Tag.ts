import {Controller, Params,Param, Request, RequestMapping, BaseController, Body} from "koa-msc";
import {TagService} from "@/services/Tag";
import {Tag} from "@/models/Tag";
import {Pagination, success} from "@/utils";

@Controller('/tag')
export class TagController extends BaseController<TagService>{
    @RequestMapping('/list',[Request.get,Request.post])
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getTagList(pagination:Pagination,condition){
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
    async add(_,tagInfo:Omit<Tag, 'id'>,ctx){
        tagInfo['creatorId']=ctx.state.user.id
        await this.service.add(tagInfo)
        return success(true,'添加标签成功')
    }
    @RequestMapping('/update',Request.put)
    @Param('id',{required:true})
    @Body({
        name:{type:"string",required:true}
    })
    async update(condition:Pick<Tag, 'id'>,roleInfo:Partial<Omit<Tag, 'id'>>){
        await this.service.update(condition,roleInfo)
        return success(true,'修改标签成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Param('id',{required:true})
    async delete(condition:Pick<Tag, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除标签成功')
    }
}