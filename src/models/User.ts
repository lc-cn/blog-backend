import {BelongsTo, BelongsToMany, Column, HasMany, Model, Table} from "koa-msc";
import {DataTypes} from 'sequelize'
import * as crypto from "crypto";
import {Tag} from "@/models/Tag";
import {Article} from "@/models/Article";
import {Category} from "@/models/Category";
import {Comment} from "@/models/Comment";
import {Role} from "@/models/Role";
@Table
@HasMany(()=>Tag)
@HasMany(()=>Article)
@HasMany(()=>Category)
@HasMany(()=>Comment)
@BelongsTo(()=>User,{as:'creator'})
@HasMany(()=>User)
@BelongsToMany(()=>Role,{through:'userRole',as:'roles'})
export class User extends Model{
    id:number
    @Column(DataTypes.TEXT)
    name:string
    @Column(DataTypes.INTEGER)
    age:number
    @Column({
        type:DataTypes.TEXT,
        set(value:string) {
            this.setDataValue('password',crypto.createHash('md5').update(value).digest('hex'))
        }
    })
    password:string
    @Column(DataTypes.TEXT)
    email:string
}