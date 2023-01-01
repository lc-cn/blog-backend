import {BaseService, Service} from "koa-msc";
import {Category} from "@/models/Category";
@Service
export class CategoryService extends BaseService<Category>{
}