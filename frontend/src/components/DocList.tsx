import React, {useContext, useEffect, useState} from "react"
import { Link } from "react-router-dom";
import {Document} from "../types/types"
// import {useGlobalState} from "../GTWContext";
// import {GTW} from "../LocalStorage";
// import { GlobalState } from "../GTWContext";
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

    return (
        <div className="docs">
        {
            docs.map((item:Document, i:number) =>{
                return <Link to={`/docs/${i}`}><Doc name={item.doc_name} daysUntilReview={item.daysUntilReview}/></Link>
            })
        } 
        </div>  
    )
}