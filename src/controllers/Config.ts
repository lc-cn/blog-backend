import {Controller, Params,Param, Request, RequestMapping, BaseController, Body} from "koa-msc";
import {ConfigService} from "@/services/Config";
import {Config} from "@/models/Config";
import {Pagination, success} from "@/utils";

@Controller('/config')
export class ConfigController extends BaseController<ConfigService>{
    @RequestMapping('/all',[Request.get])
    async getAllConfig(){
        return success(await this.service.list({pId:null},{
            include:{
                model:this.service.model,
                as:'configs'
            },
        }))
    }
    @RequestMapping('/list',[Request.get,Request.post])
    @Params({
        pageNum:{type:"number"},
        pageSize:{type:'number'}
    })
    async getConfigList(pagination:Pagination,condition){
        return success(await this.service.pagination(condition,pagination.pageNum,pagination.pageSize))
    }
    @RequestMapping('/info',Request.get)
    @Param('id',{type: "string", required: true,pattern:/^\d+$/})
    async info({id}){
        return success(await this.service.info({id:Number(id)}))
    }
    @RequestMapping('/add',Request.post)
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
        return success(true,'添加配置成功')
    }
    @RequestMapping('/update',Request.put)
    @Param('id',{type: "string", required: true,pattern:/^\d+$/})
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
        return success(true,'修改配置成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Param('id',{type: "string", required: true,pattern:/^\d+$/})
    async delete(condition:Pick<Config, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除配置成功')
    }
}