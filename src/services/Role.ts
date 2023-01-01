import {BaseService, Service} from "koa-msc";
import {Role} from "@/models/Role";

@Service
export class RoleService extends BaseService<Role>{
}