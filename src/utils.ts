import {Model} from "sequelize";
import {Menu} from "@/models/Menu";
import {Config} from "@/models/Config";

export function success(data:any,message='',code=200){
    return {data,code,message,success:true}
}
export function error(message:string,code=500){
    return {data:null,message,code,success:false}
}
type Tree<T extends object>=T&{children:Tree<T>[]}
export async function toTree<T extends object>(model:Model<T,T>,fnName='getChildren'){
    const menu=await model.toJSON()
    const children=await model[fnName]()
    return {
        ...menu,
        children: await Promise.all(children.map(async (item) => toTree(item,fnName)))
    } as unknown as Tree<T>
}
export async function toObject(models:Model<Config,Config>[]){
    let result:Record<string, any>={}
    for(let model of models){
        const children=await model['getConfigs']()
        result[model.getDataValue('key')]=children.length?
            await toObject(children):
            model.getDataValue('value')
    }
    return result
}
export type Pagination={
    pageSize?:number
    pageNum?:number
}
export class AppErr extends Error{
    constructor(message:string,public code=500) {
        super(message);
    }
}