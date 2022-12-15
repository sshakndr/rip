export interface ITask {
    id: number
    text: string
    readiness: boolean
    user_id: number
}

export interface IUserInfo {
    token:string
    user:{
        email:string
        id:number
    }
}