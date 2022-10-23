export function success(data:any,code=200){
    return {data,code,message:'',success:true}
}
export function error(message:string,code=500){
    return {data:null,message,code,success:false}
}
export class AppErr extends Error{
    constructor(message:string,public code=500) {
        super(message);
    }
}