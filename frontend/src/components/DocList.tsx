import React, {useContext, useEffect, useState} from "react"
import { Link } from "react-router-dom";
import Document from "../types/doc"
import {useGlobalState} from "../GTWContext";
import {DocumentType} from "../types/types";
interface Props {
    docs: Document[]
}

function Paper(){
    return (
        <div style={{"backgroundColor": "white", "height": "12em", "width": "8em"}}>
        </div>
    )
}

function Doc(props: {name:string; daysUntilReview:number;}){
    return (
        <div className="doc">
            <Paper/>
            <h3>{props.name}</h3>
            {props.daysUntilReview > 0
            ?
            <span className="button" style={{backgroundColor:"darkblue"}}>
                {props.daysUntilReview} days until Review
            </span>
            :            
            <span className="button" style={{backgroundColor:"darkred"}}>
                Review Overdue
            </span>
            }
        </div>
    )
}

export const DocList: React.FC<Props> = ({docs}) => {

    const {state, setState} = useGlobalState()
    const updateReviewDueAllDocs = (docs: Document[]): Document[] => {
        for (let i = 0 ; i<docs.length-1; i++){
            const strictDoc: Document = new Document(docs[i].doc_name, docs[i].review_freq).fromJSON(docs[i])
            docs[i] = strictDoc
        }
        localStorage.setItem('gtw', JSON.stringify(docs))
        setState(docs)
        return docs
    }

    const [updatedDocs, setDocs] = useState<Document[]>(updateReviewDueAllDocs(docs))

    useEffect(() => {
        setDocs(updateReviewDueAllDocs(docs))
    },[docs])
    
    return (
        <div className="docs">
        {
            updatedDocs.map((item:Document, i:number) =>{
                console.log(item);
                return <Link to={`/docs/${i}`}><Doc name={item.doc_name} daysUntilReview={item.daysUntilReview}/></Link>
            })
        } 
        </div>  
    )
}