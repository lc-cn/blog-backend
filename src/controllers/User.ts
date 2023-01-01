import {Controller, Param, Request, RequestMapping, BaseController, Body,} from "koa-msc";
import * as crypto from "crypto";
import {config} from "dotenv";
import {UserService} from "@/services/User";
import {AppErr, success} from "@/utils";
import * as jwt from "jsonwebtoken";
import {User} from "@/models/User";

const {parsed:env}=config({path:'.env'})
@Controller('/user')
export class UserController extends BaseController<UserService>{
    @RequestMapping('/list',[Request.get,Request.post])
    @Param('pageSize',{type:"number"})
    @Param('pageNum',{type:'number'})
    async getUserList(condition){
        return success(await this.service.pagination(condition,1,10))
    }
    @RequestMapping('/login',Request.post)
    @Body({
        name:{type:"string",required:true},
        password:{type:"string",required:true}
    })
    async login(_,{name,password}){
        const user=await this.service.getInfoWithPwd({name})
        if(!user) throw new AppErr('用户不存在',406)
        const userInfo=user.toJSON()
        password=crypto.createHash('md5').update(password).digest('hex')
        if(userInfo.password!==password){
            throw new AppErr('密码错误',406)
        }
        const token= jwt.sign({id:userInfo.id,name:userInfo.name},env.AUTHSECRET,{ expiresIn: 60 * 60 })
        return success(token,'登录成功')
    }
    @RequestMapping('/info',Request.get)
    @Param('id',{type:"string"})
    async info({id},_,ctx){
        if(!id) return this.service.info({name:ctx.state.user.name})
        return success(this.service.info({id:Number(id)}))
    }
    @RequestMapping('/bindRole',Request.post)
    @Param('id',{type:"string"})
    @Body({
        'ids':{type:"array",defaultField:{type:"number"}}
    })
    async bindRole({id},{ids},ctx){
        const user=this.info({id},{},ctx)
        const roles=await this.services.role.list({id:ids})
        await user['setRoles'](roles)
        return success(true,'绑定成功')
    }
    @RequestMapping('/register',Request.post)
    @Body({
        name:{type:"string",required:true},
        age:{type:'number',min:18,max:120},
        email:{type:'email'},
        password:{type:"string",min:8,required:true}
    })
    async register(_,userInfo:User){
        if(await this.service.info({name:userInfo.name})){
            throw new AppErr('用户已存在',406)
        }
        const user=await this.service.add(userInfo)
        return success(user.toJSON(),'注册成功')
    }
    @RequestMapping('/add',Request.post)
    @Body({
        name:{type:"string",required:true},
        age:{type:'number',min:18,max:120},
        email:{type:'email'},
        password:{type:"string",min:8,required:true}
    })
    async add(_,userInfo:User,ctx){
        userInfo['creatorId']=ctx.state.user.id
        if(await this.service.info({name:userInfo.name})){
            throw new AppErr('用户已存在',406)
        }
        const user=await this.service.add(userInfo)
        return success(user.toJSON(),'添加用户成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Param('id',{required:true})
    async delete(condition:Pick<User, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除用户成功')
    }

}