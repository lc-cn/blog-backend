import {BelongsTo, BelongsToMany, Column, Model, Table} from "koa-msc";
import {User} from "@/models/User";
import {DataTypes} from "sequelize";
import {Api} from "@/models/Api";
@Table
@BelongsToMany(()=>User,{through:'userRole',as:'users'})
@BelongsToMany(()=>Api,{through:'rolePermission',as:'permissions'})
@BelongsTo(()=>User,{as:'creator'})
export class Role extends Model{
    id:number
    @Column(DataTypes.TEXT)
    name:string
}