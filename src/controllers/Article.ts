import {Controller, Params, Param, Request, RequestMapping, BaseController, Body} from "koa-msc";
import {ArticleService} from "@/services/Article";
import {Article} from "@/models/Article";
import {Pagination, success} from "@/utils";

@Controller('/article')
export class ArticleController extends BaseController<ArticleService> {
    @RequestMapping('/list', [Request.get, Request.post])
    @Params({
        pageNum: {type: "number"},
        pageSize: {type: 'number'}
    })
    @Body({
        categoryId: {type: "number"},
        tagId: {type: 'number'}
    })
    async getArticleList(pagination: Pagination, {categoryId, tagId}: { categoryId: number, tagId: number }) {
        const include = categoryId ? {
            model: this.service.models.category,
            where: {
                id: categoryId ? categoryId : tagId
            },
            through: {attributes: []}
        } : tagId ? {
            model: this.service.models.tag,
            where: {
                id: categoryId ? categoryId : tagId
            },
            through: {attributes: []}
        } : undefined
        return success(await this.service.pagination(
            undefined,
            pagination.pageNum,
            pagination.pageSize,
            undefined,
            {
                include
            })
        )
    }

    @RequestMapping('/info', Request.get)
    @Param('id', {type: "number"})
    async info({id}) {
        return success(await this.service.info({id: Number(id)}))
    }

    @RequestMapping('/add', Request.post)
    @Body({
        title: {type: "string", required: true},
        content: {type: "string", required: true},
        categoryIds: {type: "array", required: true, defaultField: {type: "number", required: true}},
        tagIds: {type: "array", required: true, defaultField: {type: "number", required: true}}
    })
    async add(_, {
        categoryIds = [],
        tagIds = [],
        ...articleInfo
    }: Omit<Article & { categoryIds: number[], tagIds: number[] }, 'id'>, ctx) {
        articleInfo['creatorId'] = ctx.state.user.id
        const article = await this.service.add(articleInfo)
        const tags = await this.services.tag.list({id: tagIds})
        const categories = await this.services.category.list({id: categoryIds})
        await article['setTags'](tags)
        await article['setCategories'](categories)
        return success(true, '添加文章成功')
    }

    @RequestMapping('/update', Request.put)
    @Param('id', {type: "number"})
    @Body({
        title: {type: "string", required: true},
        content: {type: "string", required: true},
        categoryIds: {type: "array", required: true, defaultField: {type: "number", required: true}},
        tagIds: {type: "array", required: true, defaultField: {type: "number", required: true}}
    })
    async update(condition: Pick<Article, 'id'>, {
        categoryIds = [],
        tagIds = [],
        ...articleInfo
    }: Partial<Omit<Article & { categoryIds: number[], tagIds: number[] }, 'id'>>) {
        const article = await this.service.info(condition)
        await article.update(articleInfo)
        const tags = await this.services.tag.list({id: tagIds})
        const categories = await this.services.category.list({id: categoryIds})
        await article['setTags'](tags)
        await article['setCategories'](categories)
        return success(true, '编辑文章成功')
    }

    @RequestMapping('/delete', Request.delete)
    @Param('id', {type: "number"})
    async delete(condition: Pick<Article, 'id'>) {
        await this.service.delete(condition)
        return success(true, '删除文章成功')
    }
}