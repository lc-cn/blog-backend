import {Middleware} from "koa";
import {App} from "koa-msc";
import * as koaJwt from "koa-jwt";
const jwt = require('jsonwebtoken');
import {AppErr} from "@/utils";
export const auth=(app)=>{
    return koaJwt({secret:app.envConfig.AUTHSECRET})
        .unless({
            path:[
                '/api/user/login',
                '/api/user/register',
                '/api/user/info',
                '/api/article/list',
                '/api/config/all',
                /!^\/api\/.*/
            ]
        })
}
export const checkPermission=(app)=>{
    const middleware:Middleware=async (ctx, next)=>{
        if(!ctx.state.user || !ctx.url.startsWith('/api')){
            if(ctx.url.match(/^\/api\/user\/(register|login)/)){
                return next()
            }else if(!ctx.state.user){
                const {authorization=''}=ctx.request.headers
                const [bearer,token='']=authorization.split(' ')
                if(bearer==='Bearer' && token && token!=='undefined'){
                    ctx.state.user=jwt.verify(token, app.envConfig.AUTHSECRET)
                }else{
                    ctx.state.user={
                        id:2,
                        username:'anonymous'
                    }
                }
            }
        }
        const roleModels=await app.model('role').findAll({
            attributes:['id'],
            include:[
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
                },

                {
                    model:app.model('menu'),
                    attributes:['id'],
                    as:'menus',
                    include:[
                        {
                            model:app.model('api'),
                            attributes:['id','methods','url'],
                            as:'apis',
                            through:{
                                attributes:['apiId','menuId']
                            }
                        },
                    ]
                },
            ]
        })
        const apis=roleModels.map(role=>role.toJSON().menus.map(menu=>menu.apis)).flat(Infinity)
        if(!apis.find(api=>{
            return ctx.url.startsWith(`/api/${api.url}`) && api.methods.includes(ctx.method.toUpperCase())
        })) throw new AppErr('权限不足',403)
        await next()
    }
    return middleware
}