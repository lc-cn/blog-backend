import {BaseModel, BelongsTo, BelongsToMany, Column, Comment, Model} from "koa-msc";
import {User} from "@/models/User";
import {DataTypes} from "sequelize";
import {Menu} from "@/models/Menu";
@Model
@BelongsToMany(()=>User,{through:'userRole',as:'users'})
@BelongsToMany(()=>Menu,{through:'roleMenus',as:'routes'})
@BelongsTo(()=>User,{as:'creator'})
export class Role extends BaseModel{
    id:number
    @Column(DataTypes.TEXT)
    @Comment('角色名')
    name:string
}