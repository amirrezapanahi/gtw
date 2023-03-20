import { unset } from "lodash";
import React, { useContext, useEffect, useState } from "react"
import { Link } from "react-router-dom";
import { Document } from "../types/types"
import { GTW } from "../LocalStorage";
import { GlobalState } from "../GTWContext";
interface Props {
  docs: Document[]
}

function Paper() {
  return (
    <div style={{ "backgroundColor": "white", "height": "12em", "width": "8em" }}>
    </div>
  )
}

function Doc(props: { name: string; daysUntilReview: number; id: number; }) {

  const {state, setState} = useContext(GlobalState)
  const { removeDoc, getGTW, backupDoc, getDocIndex } = GTW();

  const deleteDoc = () => {
    const docIndex = getDocIndex(props.id)
    removeDoc(docIndex)
    setState(getGTW())
  }

  const backupDocDocList = () => {
    const docIndex = getDocIndex(props.id)
    backupDoc(docIndex)
    setState(getGTW())
  }

  return (
    <div className="doc">
      <Link to={`/docs/${props.id}/dashboard`}><Paper /></Link>
      <h3>{props.name}</h3>
      {props.daysUntilReview > 0
        ?
        <span className="button" style={{ backgroundColor: "darkblue" }}>
          {props.daysUntilReview} days until Review
        </span>
        :
        <span className="button" style={{ backgroundColor: "darkred" }}>
          Review Overdue
        </span>
      }
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
        <button style={{ padding: 'unset', marginTop: '0.3em' }} onClick={deleteDoc} title="Delete"><i className="fa-solid fa-trash" style={{ height: '50%' }}></i></button>
        <button style={{ padding: 'unset', marginTop: '0.3em' }} onClick={backupDocDocList} title="Back Up"><i className="fa-solid fa-box" style={{ height: "50%" }}></i></button>
      </div>
    </div>
  )
}

export const DocList: React.FC<Props> = ({ docs }) => {

  const [docsSorted, setSorted] = useState(() => {
    return docs.sort((a, b) => { return a.daysUntilReview - b.daysUntilReview })
  });

  useEffect(() => {
    setSorted(docs.sort((a, b) => { return a.daysUntilReview - b.daysUntilReview }))
  }, [docs])

  return (
    <div className="docs">
      {
        docsSorted.map((item: Document) => {
          return <Doc name={item.doc_name} daysUntilReview={item.daysUntilReview} id={item.docID} />
        })
      }
    </div>
  )
}