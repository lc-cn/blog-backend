import {BaseModel, Comment, Column, Model, BelongsTo} from "koa-msc";
import {DataTypes} from "sequelize";
import {User} from "@/models/User";
@Model
@BelongsTo(()=>User)
export class Link extends BaseModel{
    id:number
    @Column(DataTypes.TEXT)
    @Comment('博客icon')
    icon:string
    @Column(DataTypes.TEXT)
    @Comment('博客名称')
    name:string
    @Column(DataTypes.TEXT)
    @Comment('博客描述')
    desc:string
    @Column(DataTypes.TEXT)
    @Comment('博客地址')
    url:string
}