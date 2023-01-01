import {BaseModel,Comment, BelongsToMany, Column, Model} from "koa-msc";
import {Rules} from 'async-validator'
import {DataTypes} from "sequelize";
import {Menu} from "@/models/Menu";
@Model
@BelongsToMany(()=>Menu,{through:'routePermissions',as:'routes'})
export class Api extends BaseModel{
    id:number
    @Column(DataTypes.TEXT)
    @Comment('请求地址')
    url:string
    @Column(DataTypes.TEXT)
    @Comment('接口描述')
    desc:string
    @Column(DataTypes.TEXT)
    @Comment('标签')
    tag:string
    @Column({
        type:DataTypes.TEXT,
        defaultValue:'null',
        get() {
            return JSON.parse(this.getDataValue('methods')||'null')||[]
        },
        set(value){
            this.setDataValue('methods',JSON.stringify(value))
        }
    })
    @Comment('请求方式:[GET,POST,PUT,DELETE]')
    methods:string[]
    @Column({
        type:DataTypes.TEXT,
        defaultValue:"null",
        get() {
            return JSON.parse(this.getDataValue('query')||'null')||[]
        },
        set(value){
            this.setDataValue('query',JSON.stringify(value))
        }
    })
    @Comment('queryParam校验配置')
    query:Rules[]
    @Column({
        type:DataTypes.TEXT,
        defaultValue:"null",
        get() {
            return JSON.parse(this.getDataValue('body')||'null')||[]
        },
        set(value){
            this.setDataValue('body',JSON.stringify(value))
        }
    })
    @Comment('请求体校验配置')
    body:Rules[]

}