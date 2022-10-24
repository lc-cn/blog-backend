import {BelongsTo, BelongsToMany, Column, Model, Table} from "koa-msc";
import {User} from "@/models/User";
import {DataTypes} from "sequelize";
import {Article} from "@/models/Article";
@Table
@BelongsTo(()=>User,{as:'creator'})
@BelongsToMany(()=>Article,{through:'articleTag'})
export class Tag extends Model{
    id:number
    @Column(DataTypes.TEXT)
    name:string
}