import {Controller, Params,Param, Request, RequestMapping, BaseController, Body} from "koa-msc";
import {CategoryService} from "@/services/Category";
import {Category} from "@/models/Category";
import {Pagination, success} from "@/utils";

@Controller('/category')
export class CategoryController extends BaseController<CategoryService>{
    @RequestMapping('/list',[Request.get,Request.post])
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getCategoryList(pagination:Pagination,condition){
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
    async add(_,categoryInfo:Omit<Category, 'id'>,ctx){
        categoryInfo['creatorId']=ctx.state.user.id
        await this.service.add(categoryInfo)
        return success(true,'添加分类成功')
    }
    @RequestMapping('/update',Request.put)
    @Param('id',{required:true})
    @Body({
        name:{type:"string",required:true}
    })
    async update(condition:Pick<Category, 'id'>,roleInfo:Partial<Omit<Category, 'id'>>){
        await this.service.update(condition,roleInfo)
        return success(true,'修改分类成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Param('id',{required:true})
    async delete(condition:Pick<Category, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除分类成功')
    }
}