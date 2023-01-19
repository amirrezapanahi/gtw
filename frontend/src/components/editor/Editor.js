import { useState } from "react";
import ExampleTheme from "./ExampleTheme";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import TreeViewPlugin from "./TreeViewPlugin";
import ToolbarPlugin from "./ToolbarPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS } from "@lexical/markdown";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import "./editor.css";

import ListMaxIndentLevelPlugin from "./ListMaxIndentLevelPlugin";
import CodeHighlightPlugin from "./CodeHighlightPlugin";
import AutoLinkPlugin from "./AutoLinkPlugin";
import { useEffect } from "react";
import {useGlobalState} from "../../GTWContext";

function Placeholder() {
  return <div className="editor-placeholder">Enter some rich text...</div>;
}

// 'empty' editor
const emptyEditor = '{"root":{"children":[{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1}],"direction":null,"format":"","indent":0,"type":"root","version":1}}';

export default function Editor({docIndex}) {

  const {state, setState} = useGlobalState()
  const loadContent = () => {
    console.log(docIndex)
    // let editorState = JSON.parse(localStorage.getItem('gtw'))
    let editorState = state;
    return editorState[docIndex].content === '' ? emptyEditor : JSON.stringify(editorState[docIndex].content);
  }
  
  const initialState = loadContent()
  
  const editorConfig = {
    editorState: initialState,
    // The editor theme
    theme: ExampleTheme,
    // Handling of errors during update
    onError(error) {
      throw error;
    },
    // Any custom nodes go here
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
      AutoLinkNode,
      LinkNode
    ]
  };
  return (
    <LexicalComposer initialConfig={editorConfig} >
      <div className="editor-container">
        <ToolbarPlugin docIndex={docIndex}/>
        <div className="editor-inner">
          <RichTextPlugin
            contentEditable={<ContentEditable className="editor-input" />}
            placeholder={<Placeholder />}
            ErrorBoundary={LexicalErrorBoundary}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <CodeHighlightPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
        </div>
      </div>
    </LexicalComposer>
  );
}
