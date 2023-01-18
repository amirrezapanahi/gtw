export type TaskType = {
    description: string;
    dueDate: Date;
    priority: Priority;
    dependentOn: TaskType[];
    
}

export type DocumentType = {
    doc_name: string;
    content: string;
    _inbox: Array<TaskType>;
    last_reviewed: Date;
    next_reviewed: Date;
    created_at: Date;
    review_freq: number;
}

export enum Priority{
    High = 0,
    Mid = 1,
    Low = 2
}


export type ReferenceMaterialInterface = {

}