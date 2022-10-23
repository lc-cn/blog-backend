import {App} from "koa-msc";
import {resolve} from 'path'
import {config} from "dotenv";
import * as jwt from "koa-jwt";
import {AppErr, error} from "@/utils";
const {parsed:env}=config({path:'.env'})
const app=new App({
    log_level:'info',
    controller_path:resolve(__dirname,'controllers'),
    service_path:resolve(__dirname,'services'),
    model_path:resolve(__dirname,'models'),
    router:{
      prefix:'/api'
    },
    sequelize:{
        host:env.HOST,
        database:env.DATABASE,
        username:env.USERNAME,
        password:env.PASSWORD,
        logging:(msg)=>app.logger.debug(msg),
        port:Number(env.PORT||'3306'),
        dialect:'mysql'
    }
})
app.envConfig=env
app.use((ctx,next)=>{
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
})
    .use(jwt({secret:env.AUTHSECRET})
        .unless({
        path:[
            '/api/user/login',
            '/api/user/register',
            /!^\/api\/.*/
        ]
        }))
app.start(8080)