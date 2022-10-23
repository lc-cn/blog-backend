import {BelongsToMany, Column, Model, Table} from "koa-msc";
import {DataTypes} from "sequelize";
import {Role} from "@/models/Role";
@Table
@BelongsToMany(()=>Role,{through:'rolePermission'})
export class Api extends Model{
    @Column(DataTypes.TEXT)
    url:string
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
    methods:string[]
    @Column({
        type:DataTypes.TEXT,
        defaultValue:"null",
        get() {
            return JSON.parse(this.getDataValue('rules')||'null')||[]
        },
        set(value){
            this.setDataValue('rules',JSON.stringify(value))
        }
    })
    rules:any[]

}