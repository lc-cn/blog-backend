import {BelongsTo, Column, HasMany, Model, Table} from "koa-msc";
import {DataTypes} from "sequelize";
import {Article} from "@/models/Article";
import {User} from "@/models/User";
@Table
@HasMany(()=>Article)
@BelongsTo(()=>User)
export class Category extends Model{
    @Column(DataTypes.TEXT)
    name:string
}