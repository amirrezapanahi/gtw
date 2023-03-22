import { useEffect, useContext, useState } from "react";
import React from "react";
import { DocList } from "./DocList";
import { Document } from "../types/types"
import { GlobalState } from "../GTWContext";
import { GTW } from "../LocalStorage";
import { read } from "fs";
import { Badge, Text } from "@mantine/core";

export const Usage: React.FC = () => {
  const { state, setState } = useContext(GlobalState);
  const { addDoc, setGTW, getGTW, localStorageSizePercentage } = GTW()

  const [addDocBool, setAddDocBool] = useState<boolean>(false);
  const [importDoc, setImportDoc] = useState<boolean>(false);


  return (
    <div className="App" style={{ width: '100%', display: 'grid' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h1><a href="/" style={{ textDecoration: 'none' }}>Getting Things Written.</a></h1>
          <Badge variant="outline"><a href="/usage">How to Use</a></Badge>
        </div>
        <br></br>
        <h3>Write. Journal. Research.</h3>
<iframe width="560" height="315" src="https://www.youtube.com/embed/L0SB_CNqX2g" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
        <Text fz="sm" ta="center" style={{ marginTop: '2em' }}>
          Consolidate your thoughts and ideas with this powerful writing tool which adopts the 'Getting Things Done' methodology
          by David Allen. <strong>'Getting Things Written'</strong> provide a productive writing experience. Make context switching across different documents a breeze
          and never feel flustered again.
        </Text>
      </div>
      <Text fz='xs' c="dimmed" style={{ display: 'block', margin: '0 auto', marginTop: '5em' }}>Storage Used: {localStorageSizePercentage().toPrecision(3)} %</Text>
      <Text fz='xs' c="dimmed" style={{ display: 'block', margin: '0 auto', fontSize: '10px', marginTop: '2em' }}>
        <strong>Privacy notice</strong>: This webpage simply downloads the Getting Things Written application to your browser.
        Once loaded, everything runs locally in your browser. No data is sent back to the server.
      </Text>
    </div>
  );
}