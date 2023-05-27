import {Controller, Params, Param, Request, Tag, RequestMapping, BaseController, Body, Describe} from "koa-msc";
import {TagService} from "@/services/Tag";
import {Tag as TagInfo} from "@/models/Tag";
import {error, Pagination, success} from "@/utils";

@Controller('/tag','标签管理')
export class TagController extends BaseController<TagService>{
    @RequestMapping('/list',[Request.get,Request.post])
    @Describe('获取标签列表')
    @Tag('标签','列表')
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getTagList(pagination:Pagination,condition){
        return success(await this.service.pagination(condition,pagination.pageNum,pagination.pageSize))
    }
    @RequestMapping('/articles',[Request.get])
    @Describe('获取标签下的文章列表')
    @Tag('标签','文章列表')
    @Param('id',{type: "number"})
    async getArticlesByTag({id}){
        const tag=await this.service.info({id:Number(id)},{
            rejectOnEmpty:false,
            include:[
                {
                    model:this.service.models.article,
                    as:'articles',
                }
            ]
        })
        if(!tag) return error('标签不存在',404)
        return success(tag.toJSON())
    }
    @RequestMapping('/info',Request.get)
    @Describe('获取标签详情')
    @Tag('标签','详情')
    @Param('id',{type: "number"})
    async info({id}){
        return success(await this.service.info({id:Number(id)}))
    }
    @RequestMapping('/add',Request.post)
    @Describe('添加标签')
    @Tag('标签','添加')
    @Body({
        name:{type:"string",required:true}
    })
    async add(_,tagInfo:Omit<TagInfo, 'id'>,ctx){
        tagInfo['creatorId']=ctx.state.user.id
        await this.service.add(tagInfo)
        return success(true,'添加标签成功')
    }
    @RequestMapping('/update',Request.put)
    @Describe('修改标签')
    @Tag('标签','修改')
    @Param('id',{type: "number"})
    @Body({
        name:{type:"string",required:true}
    })
    async update(condition:Pick<TagInfo, 'id'>,tagInfo:Partial<Omit<TagInfo, 'id'>>){
        await this.service.update(condition,tagInfo)
        return success(true,'修改标签成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Describe('删除标签')
    @Tag('标签','删除')
    @Param('id',{type: "number"})
    async delete(condition:Pick<TagInfo, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除标签成功')
    }
}