import {BaseModel,Comment as SComment, BelongsTo, BelongsToMany, Column, HasMany, Model} from "koa-msc";
import {DataTypes} from "sequelize";
import {Category} from "@/models/Category";
import {User} from "@/models/User";
import {Tag} from "@/models/Tag";
import {Comment} from "@/models/Comment";
@Model
@BelongsToMany(()=>Category,{through:'articleCategories',as:'categories'})
@BelongsTo(()=>User,{as:'author'})
@HasMany(()=>Comment,{as:'comments'})
@BelongsToMany(()=>Tag,{through:'articleTags',as:'tags'})
export class Article extends BaseModel{
    id:number
    @Column(DataTypes.TEXT)
    @SComment('文章标题')
    title:string
    @Column(DataTypes.TEXT)
    @SComment('文章正文')
    content:string
}