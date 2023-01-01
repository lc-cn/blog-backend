import {BaseService, Service} from "koa-msc";
import {Comment} from "@/models/Comment";
@Service
export class CommentService extends BaseService<Comment>{
}