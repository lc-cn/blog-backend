import {BaseModel,Comment as SC, BelongsTo, BelongsToMany, Column, HasMany, Model} from "koa-msc";
import {DataTypes} from 'sequelize'
import * as crypto from "crypto";
import {Tag} from "@/models/Tag";
import {Article} from "@/models/Article";
import {Category} from "@/models/Category";
import {Comment} from "@/models/Comment";
import {Role} from "@/models/Role";
import {Menu} from "@/models/Menu";
import {Link} from "@/models/Link";
@Model
@HasMany(()=>Tag)
@HasMany(()=>Menu,{as:'routes'})
@HasMany(()=>Article)
@HasMany(()=>Category)
@HasMany(()=>Comment)
@HasMany(()=>User)
@HasMany(()=>Link,{as:'links'})
@BelongsTo(()=>User,{as:'creator'})
@BelongsToMany(()=>Role,{through:'userRole',as:'roles'})
export class User extends BaseModel{
    id:number
    @Column({
        type:DataTypes.TEXT,
        allowNull:false,
    })
    @SC('用户名')
    username:string
    @Column(DataTypes.TEXT)
    @SC('昵称')
    nickname:string
    @Column(DataTypes.INTEGER)
    @SC('年龄')
    age:number
    @Column({
        type:DataTypes.TEXT,
        set(value:string) {
            this.setDataValue('password',crypto.createHash('md5').update(value).digest('hex'))
        }
    })
    @SC('密码')
    password:string
    @Column(DataTypes.TEXT)
    @SC('邮箱')
    email:string
}