import {BaseModel, BelongsTo, BelongsToMany, Column, Comment, HasMany, Model} from "koa-msc";
import {DataTypes} from "sequelize";
import {Article} from "@/models/Article";
import {User} from "@/models/User";
@Model
@BelongsToMany(()=>Article,{through:'articleCategories',as:'articles'})
@BelongsTo(()=>User,{as:'creator'})
@BelongsTo(()=>Category,{foreignKey:'pId'})
@HasMany(()=>Category,{as:'children'})
export class Category extends BaseModel{
    id:number
    @Column(DataTypes.TEXT)
    @Comment('分类名')
    name:string
    pId:number|null
}