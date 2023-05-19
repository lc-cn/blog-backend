import {App, BaseService} from "koa-msc";
import {ModelStatic} from 'sequelize'
import {config} from "dotenv";
import {auth, errorHandler, checkPermission} from "@/middlewares";
import {Article} from "@/models/Article";
import {Api} from "@/models/Api";
import {Category} from "@/models/Category";
import {Config} from "@/models/Config";
import {Link} from "@/models/Link";
import {Menu} from "@/models/Menu";
import {Role} from "@/models/Role";
import {Tag} from "@/models/Tag";
import {User} from "@/models/User";
import {Model} from "sequelize";
declare module "koa-msc" {
    namespace App {
        interface Services{
            api:BaseService<Api>
            article:BaseService<Article>
            category:BaseService<Category>
            config:BaseService<Config>
            link:BaseService<Link>
            menu:BaseService<Menu>
            role:BaseService<Role>
            tag:BaseService<Tag>
            user:BaseService<User>
        }
        interface Models{
            api:ModelStatic<Model<Api,Api>>
            article:ModelStatic<Model<Article,Article>>
            category:ModelStatic<Model<Category,Category>>
            config:ModelStatic<Model<Config,Config>>
            link:ModelStatic<Model<Link,Link>>
            menu:ModelStatic<Model<Menu,Menu>>
            role:ModelStatic<Model<Role,Role>>
            tag:ModelStatic<Model<Tag,Tag>>
            user:ModelStatic<Model<User,User>>
        }
    }
}
const {parsed: env} = config({path: '.env'})
const app = new App({
    log_level: 'info',
    controller_path: 'src/controllers',
    service_path: 'src/services',
    model_path: 'src/models',
    router: {
        prefix: '/api',
    },
    transaction: true,
    sequelize: {
        host: env.HOST,
        database: env.DATABASE,
        username: env.USERNAME,
        password: env.PASSWORD,
        logging: (msg) => app.logger.debug(msg),
        port: Number(env.PORT || '3306'),
        dialect: 'mysql'
    }
})
app.envConfig = env
app.on('ready', async () => {
    for (const api of app.apis) {
        const [model,isCreate] = await app.model('api').findOrCreate({
            where: {
                url: api.path,
            },
            defaults: {
                methods: api.methods,
                query: api.query,
                body: api.body
            }
        })
        if(!isCreate) return
        await model.update({
            methods: api.methods,
            query: api.query,
            body: api.body
        })
    }
})
app.use(errorHandler)
    .use(auth(app))
    .use(checkPermission(app))
app.start(8900)