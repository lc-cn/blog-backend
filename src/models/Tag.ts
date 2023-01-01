import {BaseModel, BelongsTo, BelongsToMany, Column, Comment, Model} from "koa-msc";
import {User} from "@/models/User";
import {DataTypes} from "sequelize";
import {Article} from "@/models/Article";
@Model
@BelongsTo(()=>User,{as:'creator'})
@BelongsToMany(()=>Article,{through:'articleTags'})
export class Tag extends BaseModel{
    id:number
    @Column(DataTypes.TEXT)
    @Comment('标签名称')
    name:string
}