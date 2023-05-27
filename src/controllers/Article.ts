import {Controller, Params, Param, Request, RequestMapping, BaseController, Body, Describe, Tag} from "koa-msc";
import {ArticleService} from "@/services/Article";
import {Article} from "@/models/Article";
import {error, Pagination, success, toTree} from "@/utils";
import {Model} from "sequelize";

@Controller('/article','文章管理')
export class ArticleController extends BaseController<ArticleService> {
    @RequestMapping('/list', [Request.get, Request.post])
    @Describe('获取文章列表')
    @Tag('文章','列表')
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
    @Describe('获取文章详情')
    @Tag('文章','详情')
    @Param('id', {type: "number"})
    async info({id}) {
        const article = await this.service.info({id: Number(id)}, {
            rejectOnEmpty: false,
            include: [
                {
                    model: this.service.models.category,
                    as: 'categories',
                    through:{
                        attributes:[]
                    }
                },
                {
                    model: this.service.models.tag,
                    as: 'tags',
                    through:{
                        attributes:[]
                    }
                },
                {
                    model: this.service.models.user,
                    as: 'author',
                    attributes:['id','username','nickname','email'],
                }
            ]
        })
        if (!article) return error('文章不存在',404)
        const comments:Model<Comment,Comment>[] = await article['getComments']({
            where: {pId:null},
            include: [
                {
                    model: this.service.models.user,
                    as:'creator',
                    attributes:['id','username','nickname','email'],
                }
            ]
        })
        return success({
            ...article.toJSON(),
            comments: await Promise.all(comments.map(comment => toTree(comment,'getReplies','replies',{
                include: [
                    {
                        model: this.service.models.user,
                        as:'creator',
                        attributes:['id','username','nickname','email'],
                    }
                ]
            })))
        })
    }

    @RequestMapping('/add', Request.post)
    @Describe('添加文章')
    @Tag('文章','添加')
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
    @Describe('编辑文章')
    @Tag('文章','编辑')
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
    @Describe('删除文章')
    @Tag('文章','删除')
    @Param('id', {type: "number"})
    async delete(condition: Pick<Article, 'id'>) {
        await this.service.delete(condition)
        return success(true, '删除文章成功')
    }
}