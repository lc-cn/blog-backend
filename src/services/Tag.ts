import {BaseService, Service} from "koa-msc";
import {Tag} from "@/models/Tag";
@Service
export class TagService extends BaseService<Tag>{
}