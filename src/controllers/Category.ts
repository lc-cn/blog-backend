import {Controller, Params, Param, Request, RequestMapping, BaseController, Body, Describe, Tag} from "koa-msc";
import {CategoryService} from "@/services/Category";
import {Category} from "@/models/Category";
import {error, Pagination, success, toTree} from "@/utils";

@Controller('/category','分类接口')
export class CategoryController extends BaseController<CategoryService>{
    @RequestMapping('/tree',[Request.get,Request.post])
    @Tag('分类','树形结构')
    @Describe('获取分类树')
    async getCategoryTree(){
        const menus=await this.service.list({pId:null})
        if(!menus.length) return success([])
        return success(await Promise.all(menus.map(async item=>toTree(item))))
    }
    @RequestMapping('/list',[Request.get,Request.post])
    @Tag('分类','列表')
    @Describe('获取分类列表')
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getCategoryList(pagination:Pagination,condition){
        return success(await this.service.pagination(condition,pagination.pageNum,pagination.pageSize))
    }
    @RequestMapping('/articles',[Request.get])
    @Tag('分类','文章列表')
    @Describe('获取分类下的文章列表')
    @Param('id',{type: "number"})
    async getArticleList({id}){
        const category=await this.service.info({id:Number(id)},{
            rejectOnEmpty:false,
            include:[
                {
                    model:this.service.models.article,
                    as:'articles',
                    through:{
                        attributes:[]
                    }
                }
            ]
        })
        if(!category) return error('分类不存在',404)
        return success(category.toJSON())
    }
    @RequestMapping('/info',Request.get)
    @Tag('分类','详情')
    @Describe('获取分类详情')
    @Param('id',{type: "number"})
    async info({id}){
        return success(await this.service.info({id:Number(id)}))
    }
    @RequestMapping('/add',Request.post)
    @Tag('分类','添加')
    @Describe('添加分类')
    @Body({
        name:{type:"string",required:true}
    })
    async add(_,categoryInfo:Omit<Category, 'id'>,ctx){
        categoryInfo['creatorId']=ctx.state.user.id
        categoryInfo['categoryId']=categoryInfo.pId
        await this.service.add(categoryInfo)
        return success(true,'添加分类成功')
    }
    @RequestMapping('/update',Request.put)
    @Tag('分类','修改')
    @Describe('修改分类')
    @Param('id',{type: "number"})
    @Body({
        name:{type:"string",required:true}
    })
    async update(condition:Pick<Category, 'id'>,categoryInfo:Partial<Omit<Category, 'id'>>){
        categoryInfo['categoryId']=categoryInfo.pId
        await this.service.update(condition,categoryInfo)
        return success(true,'修改分类成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Tag('分类','删除')
    @Describe('删除分类')
    @Param('id',{type: "number"})
    async delete(condition:Pick<Category, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除分类成功')
    }
}