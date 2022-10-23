import {BelongsTo, Column, HasMany, Model, Table} from "koa-msc";
import {Article} from "@/models/Article";
import {DataTypes} from "sequelize";
import {User} from "@/models/User";
@Table
@BelongsTo(()=>Article)
@BelongsTo(()=>User)
@BelongsTo(()=>Comment,{foreignKey:'pId'})
@HasMany(()=>Comment)
export class Comment extends Model{
    @Column(DataTypes.TEXT)
    content:string
}