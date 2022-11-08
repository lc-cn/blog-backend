import {AppErr, error} from "@/utils";
import {Middleware} from "koa";
export const errorHandler:Middleware=(ctx,next)=>{
    return next().catch(e=>{
        if(e.status===401){
            ctx.status=401
            ctx.body=error('请登录',401)
        }else if(e instanceof AppErr){
            ctx.body=error(e.message,e.code)
        }else if(e.fields){
            ctx.body={
                code:1,
                fields:e['fields'],
                message:e.message,
                stack:e.stack.replace(new RegExp(process.cwd(),'g'),'').split('\n').map(str=>str.trim())
            }
        }else{
            throw e
        }
    })
}