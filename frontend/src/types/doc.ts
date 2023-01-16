import {TaskType} from "./types"

export default class Document {
  doc_name: string;
  content: string;
  _inbox: Array<TaskType>
  last_reviewed: Date;
  next_reviewed: Date;
  created_at: Date;
  review_freq: number;
  daysUntilReview: number;

  constructor(name: string, freq: number){
    this.created_at = new Date()
    this.last_reviewed = new Date()
    this.next_reviewed = new Date(new Date().setDate(new Date().getDate() + freq));
    this.review_freq = freq
    this.doc_name = name
    this.content = ""
    this._inbox = []
    this.daysUntilReview = this.reviewDue()
  }

  setTask(task: TaskType): void {
    this._inbox.push(task) 
  }

  get inbox(): Array<TaskType>{
    return this._inbox;
  }

  completeTask(index: number): void {
    this._inbox = this._inbox.splice(index, 1)
  }

  reviewDue(): number {
    const date1 = new Date()
    const date2 = this.next_reviewed;
    const diffInMilliseconds = date2.getTime() - date1.getTime();
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    return diffInDays    
  }

  fromJSON(doc: Document): Document{
    let docCopy = new Document(doc.doc_name, doc.review_freq)
    docCopy.created_at = doc.created_at 
    docCopy.last_reviewed = doc.last_reviewed
    docCopy.next_reviewed = doc.next_reviewed
    docCopy.review_freq = doc.review_freq
    docCopy.doc_name = doc.doc_name
    docCopy.content = doc.content
    docCopy._inbox = doc._inbox
    docCopy.daysUntilReview = this.reviewDue()
    return doc
  }
}
