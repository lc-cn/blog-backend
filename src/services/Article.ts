import {BaseService, Service} from "koa-msc";
import {Article} from "@/models/Article";
@Service
export class ArticleService extends BaseService<Article>{
}