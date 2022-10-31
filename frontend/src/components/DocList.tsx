import React from "react"
import { Link } from "react-router-dom";

function Paper(){
    return (
        <div style={{"backgroundColor": "white", "height": "12em", "width": "8em"}}>
        </div>
    )
}

function Doc(props: {name:string}){
    return (
        <div className="doc">
            <Paper/>
            <h3>{props.name}</h3>
        </div>
    )
}

export default function DocList(props: {docs:any}) {
    return (
        <div className="docs">
        {
            props.docs.map((item:any, i:number) =>{
                console.log(item);
                return <Link to={`/docs/${i}`}><Doc name={item}/></Link>
            })
        } 
        </div>  
    )
}