import {BaseModel,Comment as SComment, BelongsTo, Column, HasMany, Model} from "koa-msc";
import {Article} from "@/models/Article";
import {DataTypes} from "sequelize";
import {User} from "@/models/User";
@Model
@BelongsTo(()=>Article)
@BelongsTo(()=>User,{as:'creator'})
@BelongsTo(()=>Comment,{foreignKey:'pId'})
@HasMany(()=>Comment,{as:'children'})
export class Comment extends BaseModel{
    id:number
    @Column(DataTypes.TEXT)
    @SComment('评论内容')
    content:string
}