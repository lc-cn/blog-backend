import {BaseModel, Comment, Column, Model, BelongsTo, HasMany} from "koa-msc";
import {DataTypes} from "sequelize";
@Model
@BelongsTo(()=>Config,{foreignKey:'pId'})
@HasMany(()=>Config,{as:'configs'})
export class Config extends BaseModel{
    id:number
    pId:number|null
    @Column(DataTypes.TEXT)
    @Comment('配置标签')
    name:string
    @Column(DataTypes.TEXT)
    @Comment('配置描述')
    desc?:string
    @Column(DataTypes.TEXT)
    @Comment('配置键名')
    key:string
    @Column(DataTypes.INTEGER)
    @Comment('配置值类型:1string,2:number,3:boolean,4:array,5:object')
    type:1|2|3|4|5
    @Column({
        type:DataTypes.TEXT,
        defaultValue:'null',
        get() {
            return JSON.parse(this.getDataValue('value')||'null')||[]
        },
        set(value){
            this.setDataValue('value',JSON.stringify(value))
        }
    })
    @Comment('配置值')
    value:any
    @Column({
        type:DataTypes.TEXT,
        defaultValue:'null',
        get() {
            return JSON.parse(this.getDataValue('defaultValue')||'null')||[]
        },
        set(value){
            this.setDataValue('defaultValue',JSON.stringify(value))
        }
    })
    @Comment('配置默认值')
    defaultValue:any
}