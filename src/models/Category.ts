import {BelongsTo, Column, HasMany, Model, Table} from "koa-msc";
import {DataTypes} from "sequelize";
import {Article} from "@/models/Article";
import {User} from "@/models/User";
@Table
@HasMany(()=>Article)
@BelongsTo(()=>User,{as:'creator'})
export class Category extends Model{
    id:number
    @Column(DataTypes.TEXT)
    name:string
}