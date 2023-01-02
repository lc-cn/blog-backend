import {Controller, Params,Param, Request, RequestMapping, BaseController, Body} from "koa-msc";
import {CategoryService} from "@/services/Category";
import {Category} from "@/models/Category";
import {Pagination, success} from "@/utils";

@Controller('/category')
export class CategoryController extends BaseController<CategoryService>{
    @RequestMapping('/tree',[Request.get,Request.post])
    async getAllCategory(){
        return success(await this.service.list({pId:null},{
            include:{
                model:this.service.model,
                as:'children'
            }
        }))
    }
    @RequestMapping('/list',[Request.get,Request.post])
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getCategoryList(pagination:Pagination,condition){
        return success(await this.service.pagination(condition,pagination.pageNum,pagination.pageSize))
    }
    @RequestMapping('/info',Request.get)
    @Param('id',{type: "string", required: true,pattern:/^\d+$/})
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
    @Param('id',{type: "string", required: true,pattern:/^\d+$/})
    @Body({
        name:{type:"string",required:true}
    })
    async update(condition:Pick<Category, 'id'>,categoryInfo:Partial<Omit<Category, 'id'>>){
        await this.service.update(condition,categoryInfo)
        return success(true,'修改分类成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Param('id',{type: "string", required: true,pattern:/^\d+$/})
    async delete(condition:Pick<Category, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除分类成功')
    }
}