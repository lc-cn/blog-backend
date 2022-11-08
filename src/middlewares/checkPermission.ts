import {Middleware} from "koa";
import {App} from "koa-msc";
import * as jwt from "koa-jwt";
import {AppErr} from "@/utils";
export const auth=(app)=>{
    return jwt({secret:app.envConfig.AUTHSECRET})
        .unless({
            path:[
                '/api/user/login',
                '/api/user/register',
                /!^\/api\/.*/
            ]
        })
}
export const checkPermission=(app:App)=>{
    const middleware:Middleware=async (ctx, next)=>{
        if(!ctx.state.user || !ctx.url.startsWith('/api') || ctx.url.match(/^\/api\/user\/(register|login)/)) return next()
        const roleModels=await app.model('role').findAll({
            attributes:['id'],
            include:[
                {
                    model:app.model('api'),
                    attributes:['id','methods','url'],
                    as:'permissions',
                    through:{
                        attributes:['apiId','roleId']
                    }
                },
                {
                    model:app.model('user'),
                    attributes:['id'],
                    as:'users',
                    through:{
                        attributes:['userId','roleId']
                    },
                    where:{
                        id:ctx.state.user.id
                    }
                }
            ]
        })
        const apis=roleModels.map(role=>role.toJSON().permissions).flat()
        if(!apis.find(api=>{
            return ctx.url.startsWith(`/api/${api.url}`) && api.methods.includes(ctx.method.toUpperCase())
        })) throw new AppErr('权限不足',401)
        await next()
    }
    return middleware
}