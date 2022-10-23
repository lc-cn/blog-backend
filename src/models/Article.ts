import {BelongsTo, BelongsToMany, Column, HasMany, Model, Table} from "koa-msc";
import {DataTypes} from "sequelize";
import {Category} from "@/models/Category";
import {User} from "@/models/User";
import {Tag} from "@/models/Tag";
import {Comment} from "@/models/Comment";
@Table
@BelongsTo(()=>Category)
@BelongsTo(()=>User)
@HasMany(()=>Comment)
@BelongsToMany(()=>Tag,{through:'articleTag'})
export class Article extends Model{
    @Column(DataTypes.TEXT)
    title:string
    @Column(DataTypes.TEXT)
    content:string
}