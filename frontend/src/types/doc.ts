import {TaskType} from "./types"

export default class Document {
  doc_name: string;
  content: string;
  _inbox: Array<TaskType>
  last_reviewed: string;
  next_reviewed: string;
  created_at: string;
  review_freq: number;
  daysUntilReview: number;

  constructor(name: string, freq: number){
    this.created_at = new Date().toISOString().slice(0, 10);
    this.last_reviewed = new Date().toISOString().slice(0,10)
    this.next_reviewed = new Date(new Date().setDate(new Date().getDate() + freq)).toISOString().slice(0,10)
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
    let date1 = Date.parse(new Date().toISOString().slice(0,10))
    const date2 = Date.parse(this.next_reviewed.toString());
    const diffInMilliseconds = date2 - date1;
    const diffInDays = diffInMilliseconds / (1000 * 60 * 60 * 24);
    return diffInDays
  }

  fromJSON(doc: Document): Document{
    let docCopy = new Document(doc.doc_name, doc.review_freq)
    docCopy.created_at = doc.created_at 
    docCopy.last_reviewed = doc.last_reviewed
    docCopy.next_reviewed = doc.next_reviewed
    docCopy.content = doc.content
    console.log(typeof docCopy.next_reviewed)
    docCopy._inbox = doc._inbox
    docCopy.daysUntilReview = this.reviewDue()
    return doc
  }
}
