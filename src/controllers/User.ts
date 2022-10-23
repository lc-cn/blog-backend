import {App, Controller, pagination, Params, Request, RequestMapping,} from "koa-msc";
import * as crypto from "crypto";
import {config} from "dotenv";
import {UserService} from "@/services/User";
import {AppErr, success} from "@/utils";
import * as jwt from "jsonwebtoken";
import {User} from "@/models/User";

const {parsed:env}=config({path:'.env'})
@Controller('/user')
export class UserController{
    constructor(public app:App,public service:UserService,public services) {
    }
    @RequestMapping('/list',[Request.get,Request.post])
    async getUserList(condition){
        return pagination(await this.service.getUserList(condition),1,10)
    }
    @RequestMapping('/login',Request.post)
    @Params({
        name:{type:"string",required:true},
        password:{type:"string",required:true}
    })
    async login({name,password}){
        const user=await this.service.getInfo({name})
        if(!user) throw new AppErr('用户不存在',406)
        const userInfo=user.toJSON()
        if(userInfo.password!==crypto.createHash('md5').update(password).digest('hex')){
            throw new AppErr('密码错误',406)
        }
        const token= jwt.sign({name:userInfo.name},env.AUTHSECRET,{ expiresIn: 60 * 60 })
        return success(token)
    }
    @RequestMapping('/register',Request.post)
    @Params({
        name:{type:"string",required:true},
        age:{type:'number',min:18,max:120},
        email:{type:'email'},
        password:{type:"string",min:8,required:true}
    })
    async register(userInfo:User){
        if(await this.service.getInfo({name:userInfo.name})){
            throw new AppErr('用户已存在',406)
        }
        const user=await this.service.add(userInfo)
        return success(user.toJSON())
    }
    @RequestMapping('/add',Request.post)
    @Params({
        name:{type:"string",required:true},
        age:{type:'number',min:18,max:120},
        email:{type:'email'},
        password:{type:"string",min:8,required:true}
    })
    async add(userInfo:User){
        return await this.register(userInfo)
    }

}