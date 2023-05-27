import {Controller, Param, Request, RequestMapping, BaseController, Body, Describe, Tag,} from "koa-msc";
import * as crypto from "crypto";
import {config} from "dotenv";
import {UserService} from "@/services/User";
import {AppErr, success} from "@/utils";
import * as jwt from "jsonwebtoken";
import {User} from "@/models/User";

const {parsed:env}=config({path:'.env'})
@Controller('/user','用户管理')
export class UserController extends BaseController<UserService>{
    @RequestMapping('/list',[Request.get,Request.post])
    @Describe('获取用户列表')
    @Tag('用户','列表')
    @Param('pageSize',{type:"number"})
    @Param('pageNum',{type:'number'})
    async getUserList({pageNum,pageSize}){
        return success(await this.service.pagination(undefined,pageNum,pageSize,undefined,{
            attributes:['id','username','nickname','email']
        }))
    }
    @RequestMapping('/login',Request.post)
    @Describe('用户登录')
    @Tag('用户','登录')
    @Body({
        username:{type:"string",required:true},
        password:{type:"string",required:true}
    })
    async login(_,{username,password}){
        const user=await this.service.getInfoWithPwd({username})
        if(!user) throw new AppErr('用户不存在',406)
        const userInfo=user.toJSON()
        password=crypto.createHash('md5').update(password).digest('hex')
        if(userInfo.password!==password){
            throw new AppErr('密码错误',406)
        }
        const token= jwt.sign({id:userInfo.id,username:userInfo.username},env.AUTHSECRET,{ expiresIn: 60 * 60 })
        return success(token,'登录成功')
    }
    @RequestMapping('/info',Request.get)
    @Describe('获取用户详情')
    @Tag('用户','详情')
    @Param('id',{type: "number"})
    async info({id},_,ctx){
        if(!id) return success(await this.service.info({username:ctx.state.user.username}))
        return success(await this.service.info({id:Number(id)}))
    }
    @RequestMapping('/bind',Request.post)
    @Describe('绑定角色')
    @Tag('用户','绑定')
    @Param('id',{type: "number"})
    @Body({
        'roleIds':{type:"array",defaultField:{type:"number"}}
    })
    async bindRole({id},{roleIds}){
        const user=await this.service.info({id})
        const roles=await this.services.role.list({id:roleIds})
        await user['setRoles'](roles)
        return success(true,'绑定成功')
    }
    @RequestMapping('/register',Request.post)
    @Describe('用户注册')
    @Tag('用户','注册')
    @Body({
        username:{type:"string",required:true},
        password:{type:"string",min:8,required:true},
        nickname:{type:"string"},
        age:{type:'number',min:18,max:120},
        email:{type:'email'},
    })
    async register(_,userInfo:User){
        if(await this.service.info({username:userInfo.username})){
            throw new AppErr('用户已存在',406)
        }
        const user=await this.service.add(userInfo)
        return success(user.toJSON(),'注册成功')
    }
    @RequestMapping('/add',Request.post)
    @Describe('添加用户')
    @Tag('用户','添加')
    @Body({
        username:{type:"string",required:true},
        password:{type:"string",min:8,required:true},
        nickname:{type:"string"},
        age:{type:'number',min:18,max:120},
        email:{type:'email'},
    })
    async add(_,userInfo:User,ctx){
        userInfo['creatorId']=ctx.state.user.id
        if(await this.service.info({username:userInfo.username})){
            throw new AppErr('用户已存在',406)
        }
        const user=await this.service.add(userInfo)
        return success(user.toJSON(),'添加用户成功')
    }
    @RequestMapping('/modify',Request.post)
    @Describe('根据用户名更改用户信息')
    @Tag('用户','修改')
    @Body({
        username:{type:"string"},
        password:{type:"string",min:8},
        nickname:{type:"string"},
        age:{type:'number',min:18,max:120},
        email:{type:'email'},
    })
    async modifyInfo(_,userInfo:User,ctx){
        const user=await this.service.info({username:ctx.state.username})
        await user.update(userInfo)
        return success(true,'修改成功')
    }
    @RequestMapping('/update',Request.post)
    @Describe('根据id更改用户信息')
    @Tag('用户','修改')
    @Param('id',{type: "number"})
    @Body({
        username:{type:"string"},
        password:{type:"string",min:8},
        nickname:{type:"string"},
        age:{type:'number',min:18,max:120},
        email:{type:'email'},
    })
    async update(condition,userInfo:User){
        await this.service.update(condition,userInfo)
        return success(true,'修改用户成功')
    }
    @RequestMapping('/delete',Request.delete)
    @Describe('删除用户')
    @Tag('用户','删除')
    @Param('id',{type: "number"})
    async delete(condition:Pick<User, 'id'>){
        await this.service.delete(condition)
        return success(true,'删除用户成功')
    }

}