import {BaseService, Service} from "koa-msc";
import {Config} from "@/models/Config";
@Service
export class ConfigService extends BaseService<Config>{
}