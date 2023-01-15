import React from "react"
import { Link } from "react-router-dom";
import Document from "../types/doc"

interface Props {
    docs: Array<Document>
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
            <span className="button" style={{backgroundColor:"darkblue"}}>
                {props.daysUntilReview} days until Review
            </span>
        </div>
    )
}

export const DocList: React.FC<Props> = ({docs}) => {
    return (
        <div className="docs">
        {
            docs.map((item:Document, i:number) =>{
                console.log(item);
                return <Link to={`/docs/${i}`}><Doc name={item.doc_name} daysUntilReview={item.daysUntilReview}/></Link>
            })
        } 
        </div>  
    )
}