import {BaseModel,Comment, BelongsToMany, Column, Model} from "koa-msc";
import {Rules} from 'async-validator'
import {DataTypes} from "sequelize";
import {Menu} from "@/models/Menu";
@Model
@BelongsToMany(()=>Menu,{through:'menuApis',as:'menus'})
export class Api extends BaseModel{
    id:number
    @Column(DataTypes.STRING)
    @Comment('接口名称')
    name:string
    @Column(DataTypes.TEXT)
    @Comment('接口描述')
    desc:string
    @Column(DataTypes.TEXT)
    @Comment('所属分组')
    group:string
    @Column(DataTypes.TEXT)
    @Comment('请求地址')
    url:string
    @Column({
        type:DataTypes.TEXT,
        defaultValue:'[]',
        get() {
            return JSON.parse(this.getDataValue('methods')||'[]')||[]
        },
        set(value){
            this.setDataValue('methods',JSON.stringify(value))
        }
    })
    @Comment('请求方式:[GET,POST,PUT,DELETE]')
    methods:string[]
    @Column({
        type:DataTypes.TEXT,
        defaultValue:'[]',
        get() {
            return JSON.parse(this.getDataValue('tags')||'[]')||[]
        },
        set(value){
            this.setDataValue('tags',JSON.stringify(value))
        }
    })
    @Comment('标签')
    tags:string[]
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