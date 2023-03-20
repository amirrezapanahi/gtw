import React, { useEffect, useState, useCallback, useMemo, Ref, PropsWithChildren, useContext } from 'react'
import Editor from './editor/Editor';
import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import { BubbleMenu, useEditor } from '@tiptap/react';
import Highlight from '@tiptap/extension-highlight';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import { Text } from '@mantine/core'
import SubScript from '@tiptap/extension-subscript';
import FontFamily from '@tiptap/extension-font-family'
import TextStyle from '@tiptap/extension-text-style'
import { IconDeviceFloppy, IconFileExport, IconTrash } from '@tabler/icons-react';
import { GlobalState } from '../GTWContext';
import { GTW } from '../LocalStorage';
import { generateHTML, generateJSON } from '@tiptap/html'
import { ItalicControl } from '@mantine/tiptap/lib/controls';
import './editor.css'

interface Props {
  docIndex: number
  showReview: boolean
  handleResponse: (content: string) => void
  handleLoading: (value: boolean) => void
  isEditorEmpty: (value: boolean) => void
}

export const DocEditor: React.FC<Props> = ({ docIndex, showReview, handleResponse, handleLoading, isEditorEmpty }) => {

  function spawnDocument(content, options) {
    let opt = {
      window: "",
      closeChild: true,
      childId: "_blank",
    };
    Object.assign(opt, options);
    // minimal error checking
    if (content && typeof content.toString == "function" && content.toString().length) {
      let child = window.open("", opt.childId, opt.window);
      child.document.write(content.toString());
      if (opt.closeChild)
        child.document.close();
      return child;
    }
  }

  const [newContent, setNewContent] = useState("")

  const { setGTW, getGTW, backupDoc } = GTW()
  const { state, setState } = useContext(GlobalState)
  const extensions = [
    StarterKit,
    Underline,
    Link,
    Superscript,
    SubScript,
    Highlight,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ]

  const editor = useEditor({
    extensions: extensions,
    content: state[docIndex].content.all == "" ? {} : JSON.parse(state[docIndex].content.all),
  });

  useEffect(() => {
    if (editor) {
      isEditorEmpty(editor.isEmpty)
    }
  }, [editor])

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(state[docIndex].content.all == "" ? {} : JSON.parse(state[docIndex].content.all))
    }
  }, [state])

  const handleReview = async () => {

    //redirect to task component 

    //get select html

    //make call to openAI API

    const docs = state[docIndex]
    const start = editor.state.selection.from
    const end = editor.state.selection.to

    const selectionJSON = editor.view
      .state
      .doc
      .cut(start, end).toJSON();

    const selectionHTML = generateHTML(selectionJSON, extensions)

    handleLoading(true)

    const aiRes = await fetch('http://localhost:8080/review', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        html: selectionHTML
      }),
    })

    handleLoading(false)
    const aiResHtml = await aiRes.json()


    const splitData = aiResHtml.aiResponse.split('@')
    const html = splitData[1]

    const highlightedExtractJSON = generateJSON(html, extensions)

    docs.content.extract = JSON.stringify(highlightedExtractJSON)
    docs.content.start = start
    docs.content.end = end
    setGTW(state)

    editor.commands.insertContentAt({ from: start, to: end }, highlightedExtractJSON, {
      updateSelection: true,
      parseOptions: {
        preserveWhitespace: 'full',
      }
    })

    handleResponse(aiResHtml.aiResponse)
    console.log(aiResHtml.aiResponse);
  }

  return (
    <div>
      {/* <Editor docIndex={docIndex} /> */}
      <RichTextEditor editor={editor} className='rte'>
        <RichTextEditor.Toolbar >
          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Bold />
            <RichTextEditor.Italic />
            <RichTextEditor.Underline />
            <RichTextEditor.Strikethrough />
            <RichTextEditor.ClearFormatting />
            <RichTextEditor.Highlight />
            <RichTextEditor.Code />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.H1 />
            <RichTextEditor.H2 />
            <RichTextEditor.H3 />
            <RichTextEditor.H4 />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Blockquote />
            <RichTextEditor.Hr />
            <RichTextEditor.BulletList />
            <RichTextEditor.OrderedList />
            <RichTextEditor.Subscript />
            <RichTextEditor.Superscript />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Link />
            <RichTextEditor.Unlink />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.AlignLeft />
            <RichTextEditor.AlignCenter />
            <RichTextEditor.AlignJustify />
            <RichTextEditor.AlignRight />
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control
              title="Save"
              onClick={
                () => {
                  const json = editor.getJSON()
                  state[docIndex].content.all = JSON.stringify(json)
                  console.log(state[docIndex])
                  setGTW(state)
                  setState(getGTW())

                }
              }
            >
              <IconDeviceFloppy stroke={1.5} size='1rem' />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              title="Export HTML"
              onClick={
                () => {
                  console.log("export html")
                  const htmlString = generateHTML(JSON.parse(state[docIndex].content.all),
                    extensions)
                  spawnDocument(htmlString, {})
                }
              }
            >
              <IconFileExport stroke={1.5} size='1rem' />
            </RichTextEditor.Control>
            <RichTextEditor.Control
              title="Back Up"
              onClick={
                () => {
                  backupDoc(docIndex)
                }
              }
            >
              <i className="fa-solid fa-box" style={{}}></i>
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>
          {editor && showReview && (
            <BubbleMenu editor={editor}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Control
                  onClick={handleReview}
                >
                  <Text fw={700}>Review</Text>
                </RichTextEditor.Control>
              </RichTextEditor.ControlsGroup>
            </BubbleMenu>
          )}
        </RichTextEditor.Toolbar>
        <RichTextEditor.Content style={{ height: '95vh', fontFamily: 'serif' }} />
      </RichTextEditor>
    </div>
  )
}