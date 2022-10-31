import React, { useState } from 'react'

export default function AddDoc() {
    const [input, setInput] = useState<String>();

    const registerDoc = () => {
        fetch("/register-doc", {
            method: "POST",
            body: JSON.stringify({input: input})
        })
        .then(res => res.json);
    }

    return (
        <div>
            <h3>Add Document</h3>
            <input placeholder='Document Name' onChange={e => setInput(e.target.value)}></input>
        </div>
    )
}
