// import {hash,compare} from "bcryptjs"
import bcrypt from "bcryptjs"; // Works if "esModuleInterop": true in tsconfig.json


export const doHash = async (value:string,saltValue:number)=>{
    const result =  await bcrypt.hash(value,saltValue)
    return result
}

export const doHashValidation = async (value:string,hashedValue:string)=>{
    const result =await bcrypt.compare(value,hashedValue)
    return result
}