import {BelongsTo, Column, HasMany, Model, Table} from "koa-msc";
import {Article} from "@/models/Article";
import {DataTypes} from "sequelize";
import {User} from "@/models/User";
@Table
@BelongsTo(()=>Article)
@BelongsTo(()=>User,{as:'creator'})
@BelongsTo(()=>Comment,{foreignKey:'pId'})
@HasMany(()=>Comment,{as:'children'})
export class Comment extends Model{
    id:number
    @Column(DataTypes.TEXT)
    content:string
}