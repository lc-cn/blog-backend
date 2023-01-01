import {App} from "koa-msc";
import {resolve} from 'path'
import {config} from "dotenv";
import {auth, errorHandler, checkPermission} from "@/middlewares";

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
app.on('ready',async ()=>{
    for(const api of app.apis){
        const [model]=await app.model('api').findOrCreate({
            where:{
                url:api.path,
            },
            defaults:{
                methods:api.methods,
                query:api.query,
                body:api.body
            }
        })
        await model.update({
            methods:api.methods,
            query:api.query,
            body:api.body
        })
    }
})
app.use(errorHandler)
    .use(auth(app))
    .use(checkPermission(app))
app.start(8080)