import {BelongsTo, BelongsToMany, Column, Model, Table} from "koa-msc";
import {User} from "@/models/User";
import {DataTypes} from "sequelize";
import {Api} from "@/models/Api";
@Table
@BelongsToMany(()=>User,{through:'userRole'})
@BelongsToMany(()=>Api,{through:'rolePermission'})
@BelongsTo(()=>User)
export class Role extends Model{
    @Column(DataTypes.TEXT)
    name:string
}