import {Controller, Params, Param, Request, RequestMapping, BaseController, Body, Describe, Tag} from "koa-msc";
import {CommentService} from "@/services/Comment";
import {Comment} from "@/models/Comment";
import {Pagination, success} from "@/utils";

@Controller('/comment','评论管理')
export class CommentController extends BaseController<CommentService>{
    @RequestMapping('/list',[Request.get,Request.post])
    @Describe('获取评论列表')
    @Tag('评论','列表')
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getCommentList(pagination:Pagination,condition){
        return success(await this.service.pagination(condition,pagination.pageNum,pagination.pageSize))
    }
    @RequestMapping('/info',Request.get)
    @Describe('获取评论详情')
    @Tag('评论','详情')
    @Param('id',{type: "number"})
    async info({id}){
        return success(await this.service.info({id:Number(id)}))
    }
    @RequestMapping('/add',Request.post)
    @Describe('添加评论')
    @Tag('评论','添加')
    @Body({
        content:{type:"string",required:true},
        articleId:{type:"number",required:true},
        pid:{type:"number"}
    })
    async add(_,commentInfo:Omit<Comment, 'id'>,ctx){
        commentInfo['creatorId']=ctx.state.user.id
        await this.service.add(commentInfo)
        return success(true,'评论成功')
    }
    @RequestMapping('/update',Request.put)
    @Describe('修改评论')
    @Tag('评论','修改')
    @Param('id',{type: "number"})
    @Body({
        name:{type:"string",required:true}
    })
    async update(condition:Pick<Comment, 'id'>,commentInfo:Partial<Omit<Comment, 'id'>>){
        await this.service.update(condition,commentInfo)
        return success(true,'修改评论成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Describe('删除评论')
    @Tag('评论','删除')
    @Param('id',{type: "number"})
    async delete(condition:Pick<Comment, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除评论成功')
    }
}