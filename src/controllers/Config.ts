import {Controller, Params, Param, Request, RequestMapping, BaseController, Body, Tag, Describe} from "koa-msc";
import {ConfigService} from "@/services/Config";
import {Config} from "@/models/Config";
import {Pagination, success, toTree} from "@/utils";

@Controller('/config','配置项管理')
export class ConfigController extends BaseController<ConfigService>{
    @RequestMapping('/all',[Request.get])
    @Describe('获取所有配置项')
    @Tag('配置项','列表')
    async getAllConfig(){
        const configs=await this.service.list({pId:null})
        if(!configs.length) return success([])
        return success(await Promise.all(configs.map(async item=>toTree(item))))
    }
    @RequestMapping('/list',[Request.get,Request.post])
    @Describe('获取配置项列表')
    @Tag('配置项','列表')
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getConfigList(pagination:Pagination,condition){
        return success(await this.service.pagination(condition,pagination.pageNum,pagination.pageSize))
    }
    @RequestMapping('/info',Request.get)
    @Describe('获取配置项详情')
    @Tag('配置项','详情')
    @Param('id',{type: "number"})
    async info({id}){
        return success(await this.service.info({id:Number(id)}))
    }
    @RequestMapping('/add',Request.post)
    @Describe('添加配置项')
    @Tag('配置项','添加')
    @Body({
        name:{type:"string",required:true},
        key:{type:"string",required:true},
        type:{type:"number",required:true,pattern:/[1-5]/},
        desc:{type:"string"},
        configs:{type:"array",defaultField:{type:"number"}}
    })
    async add(_, {configs,...configInfo}:Omit<Config, 'id'> & {configs:number[]}){
        const config=await this.service.add(configInfo)
        if(configs){
            const options=await this.service.list({id:configs})
            await config['setConfigs'](options)
        }
        return success(true,'添加配置项成功')
    }
    @RequestMapping('/update',Request.put)
    @Describe('修改配置项')
    @Tag('配置项','修改')
    @Param('id',{type: "number"})
    @Body({
        name:{type:"string"},
        key:{type:"string"},
        type:{type:"number",pattern:/[1-5]/},
        configs:{type:"array",defaultField:{type:"number"}}
    })
    async update(condition:Pick<Config, 'id'>, {configs,...configInfo}:Partial<Omit<Config, 'id'>> & {configs?:number[]}){
        const config=await this.service.info(condition)
        await config.update(configInfo)
        if(configs){
            const options=await this.service.list({id:configs})
            await config['setConfigs'](options)
        }
        return success(true,'修改配置项成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Describe('删除配置项')
    @Tag('配置项','删除')
    @Param('id',{type: "number"})
    async delete(condition:Pick<Config, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除配置项成功')
    }
}