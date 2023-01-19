export type TaskType = {
    description: string
    dueDate: string
    priority: Priority
    dependentOn: TaskType[]
    
}

export enum Priority{
    High = 0,
    Mid = 1,
    Low = 2
}


export type ReferenceMaterialInterface = {

}