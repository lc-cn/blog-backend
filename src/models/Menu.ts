import {BaseModel, BelongsTo, BelongsToMany, Column, Comment, HasMany, Model} from "koa-msc";
import {DataTypes} from "sequelize";
import {Api} from "@/models/Api";
import {User} from "@/models/User";
@Model
@BelongsTo(()=>User,{as:'creator'})
@BelongsTo(()=>Menu,{foreignKey:'pId'})
@HasMany(()=>Menu,{as:'children'})
@BelongsToMany(()=>Api,{through:'routePermissions',as:'apis'})
export class Menu extends BaseModel{
    id:number
    @Column(DataTypes.TEXT)
    @Comment('菜单名称')
    name:string
    @Column(DataTypes.TEXT)
    @Comment('跳转地址')
    path:string
    @Column(DataTypes.TEXT)
    @Comment('渲染组件')
    component:string
    @Column(DataTypes.INTEGER)
    @Comment('菜单类型：1目录，2菜单，3按钮')
    type:1|2|3
    @Column(DataTypes.STRING)
    @Comment('菜单图标')
    icon:string
    @Column(DataTypes.INTEGER)
    @Comment('排序权重')
    sort:number

}