import React, { useEffect, useState, useCallback, useMemo, Ref, PropsWithChildren, useContext } from 'react'
import { RichTextEditor, Link, useRichTextEditorContext } from '@mantine/tiptap';
import { BubbleMenu, useEditor } from '@tiptap/react';
import { Mark, Extension } from '@tiptap/core'
import Highlight from '@tiptap/extension-highlight';
import Image from '@tiptap/extension-image'
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import { Modal, Text } from '@mantine/core'
import SubScript from '@tiptap/extension-subscript';
import CharacterCount from '@tiptap/extension-character-count'
import { IconDeviceFloppy, IconFileExport, IconPhoto, IconTrash } from '@tabler/icons-react';
import { GlobalState } from '../GTWContext';
import { GTW } from '../LocalStorage';
import { generateHTML, generateJSON } from '@tiptap/html'
import './editor.css'
import { useDisclosure } from '@mantine/hooks';
import { CaptureBlock } from './CaptureBlock';
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { EditorView } from '@tiptap/pm/view'

interface Props {
  docIndex: number
  showReview: boolean
  handleResponse: (content: string) => void
  handleLoading: (value: boolean) => void
  isEditorEmpty: (value: boolean) => void
  position: RefLines
}

type RefLines = {
  start: number | null;
  end: number | null
}

export const DocEditor: React.FC<Props> = ({ docIndex, showReview, handleResponse, handleLoading, isEditorEmpty, position }) => {

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

  const { setGTW, getGTW, backupDoc } = GTW()
  const { state, setState } = useContext(GlobalState)

  const [newContent, setNewContent] = useState("")
  const [inEditor, setInEditor] = useState(false);
  const [refLines, setRefLines] = useState<RefLines>({} as RefLines)
  const [diff, setDiff] = useState(0)
  const [prevNumChars, setPrevNumChars] = useState(state[docIndex].content.numChars)
  const [opened, { open, close }] = useDisclosure(false);

  const Hover = Extension.create({
    name: 'hover',
    addProseMirrorPlugins() {
      return [
        new Plugin({
          view: (editorView: EditorView) => {
            const tooltip = document.createElement("div");
            tooltip.className = "tooltip";
            tooltip.style.display = "none";
            editorView.dom.parentNode.appendChild(tooltip);

            function hideTooltip() {
              tooltip.style.display = "none";
            }

            function showTooltip(event: any) {
              // const { state } = editorView
              const pos = editorView.posAtCoords({ left: event.clientX, top: event.clientY })
              const node = editorView.state.doc.nodeAt(pos.pos)

              if (node && node.attrs.title) {
                tooltip.innerHTML = node.attrs.title;
                tooltip.style.top = `20px`;
                tooltip.style.left = `${20 + window.scrollX}px`;
                tooltip.style.display = "block";
              } else {
                hideTooltip();
              }
            }

            editorView.dom.addEventListener("mouseleave", hideTooltip);

            editorView.dom.addEventListener("mouseover", (event) => showTooltip(event))

            return {
              update: (view) => {
                const { state } = view;
                const { $anchor } = state.selection;

                if ($anchor.parent.attrs.title) {
                  tooltip.innerHTML = $anchor.parent.attrs.title;
                  tooltip.style.top = `20px`;
                  tooltip.style.left = `${20 + window.scrollX}px`;
                  tooltip.style.display = "block";
                } else {
                  hideTooltip();
                }
              },
              destroy: () => {
                editorView.dom.removeEventListener("mouseleave", hideTooltip);
                editorView.dom.removeEventListener("mouseover", showTooltip);
                tooltip.remove();
              },
            };
          },
        })
      ]
    }
  })

  const HighlightExtended = Highlight.extend({
    addAttributes() {
      return {
        title: {
          default: "",
          parseHTML: element => element.getAttribute('title')
        }
      }
    }
  })

  const extensions = [
    StarterKit,
    Underline,
    Link,
    Superscript,
    SubScript,
    HighlightExtended,
    Image,
    Hover,
    CharacterCount,
    TextAlign.configure({ types: ['heading', 'paragraph'] }),
  ]

  const editor = useEditor({
    onUpdate({ editor }) {
      const numChars = editor.storage.characterCount.characters()
      console.log("numChars: " + numChars + ", prev: " + getGTW()[docIndex].content.numChars)
      const diff = numChars - getGTW()[docIndex].content.numChars
      console.log(diff)
      setDiff(diff)
    },
    onFocus({ editor }) {
      console.log("line index: " + editor.state.selection.from)
    },
    onBlur({ editor }) {
      state[docIndex].content.all = JSON.stringify(editor.getJSON())
      setGTW(state)
      setState(state)
    },
    extensions: extensions,
    content: state[docIndex].content.all == "" ? {} : JSON.parse(state[docIndex].content.all)
  });

  useEffect(() => {
    setInEditor(true)
  }, [diff])

  useEffect(() => {
    if (editor) {
      const json = editor.getJSON()
      state[docIndex].content.all = JSON.stringify(json)

      for (let i = 0; i < state[docIndex]._inbox.length; i++) {
        state[docIndex]._inbox[i].referenceStart += diff
        state[docIndex]._inbox[i].referenceEnd += diff
        console.log(state[docIndex]._inbox[i].referenceStart + " -> " + state[docIndex]._inbox[i].referenceEnd)
      }

      setPrevNumChars(editor.storage.characterCount.characters())
    }
  }, [editor, inEditor])

  useEffect(() => {
    if (editor) {
      isEditorEmpty(editor.isEmpty)

      state[docIndex].content.all = JSON.stringify(editor.getJSON())
      setGTW(state)
      setState(getGTW())
    }
  }, [editor])

  useEffect(() => {
    if (editor) {
      editor.commands.setContent(state[docIndex].content.all == "" ? {} : JSON.parse(state[docIndex].content.all))
      setInEditor(false);
    }
  }, [state])

  useEffect(() => {
    if (editor && position) {
      editor.chain().focus().setTextSelection({
        from: position.start,
        to: position.end
      }).run()
      // editor.commands.setTextSelection({
      //   from: position.start,
      //   to: position.end
      // })
    }
  }, [position])

  useEffect(() => {
    state[docIndex].content.numChars = prevNumChars
    console.log("prev: " + state[docIndex].content.numChars)
    setGTW(state)
    setState(getGTW())
  }, [prevNumChars])

  const handleReview = async () => {

    //redirect to task component 

    //get select html

    //make call to openAI API

    const docs = state[docIndex]
    let start = editor.state.selection.from
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
    console.log(splitData)
    let html: string = splitData[1]
    const output = splitData[0]

    const highlightedExtractJSON = generateJSON(html, extensions)

    docs.content.extract = JSON.stringify(highlightedExtractJSON)
    docs.content.start = start
    docs.content.end = end
    setGTW(state)

    console.log("Editor.tsx (Extract JSON): ")
    console.log(highlightedExtractJSON)

    // const hasInserted = editor.commands.insertContentAt({ from: start, to: end }, highlightedExtractJSON, {
    //   updateSelection: true,
    // })

    console.log(html);
    console.log(start)
    console.log(end)

    // html = "<p title='this is a tooltip'><mark>Hello World</mark></p>"
    if (start - 2 < 0){
      start = editor.state.selection.head;
    }else{
      start = start - 2;
    }

    const hasInserted = editor.commands.insertContentAt({ from: start, to: end }, html.trim(), {
      updateSelection: true,
    })

    state[docIndex].content.all = JSON.stringify(editor.getJSON())
    setGTW(state)

    if (hasInserted) console.log("Highlighted the data")

    handleResponse(output)
  }

  const handleCapture = () => {
    setRefLines({ start: editor.state.selection.from, end: editor.state.selection.to })
    open()
  }

  // useEffect(()=>{
  //   open()
  // },[refLines])

  return (
    <div>
      {/* <Editor docIndex={docIndex} /> */}
      <Modal size='auto' opened={opened} onClose={close} title="Capture" centered>
        <CaptureBlock docIndex={docIndex} refStart={refLines.start} refEnd={refLines.end} />
      </Modal>
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
              title="Image"
              onClick={
                () => {
                  const url = window.prompt('URL')
                  if (url) {
                    editor.chain().focus().setImage({ src: url }).run()
                  }
                }
              }
            >
              <IconPhoto stroke={1.5} size='1rem' />
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>

          <RichTextEditor.ControlsGroup>
            <RichTextEditor.Control
              title="Save"
              onClick={
                () => {
                  const json = editor.getJSON()
                  state[docIndex].content.all = JSON.stringify(json)

                  for (let i = 0; i < state[docIndex]._inbox.length; i++) {
                    state[docIndex]._inbox[i].referenceStart += diff
                    state[docIndex]._inbox[i].referenceEnd += diff
                    console.log(state[docIndex]._inbox[i].referenceStart + " -> " + state[docIndex]._inbox[i].referenceEnd)
                  }

                  setPrevNumChars(editor.storage.characterCount.characters())
                }
              }
            >
              <p style={{ fontSize: '0.7em', padding: '1em' }}>Save</p>
              {/*<IconDeviceFloppy stroke={1.5} size='1rem' />*/}
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
              <p style={{ fontSize: '0.7em', padding: '1em' }}>Export HTML</p>
              {/*<IconFileExport stroke={1.5} size='1rem' />*/}
            </RichTextEditor.Control>
            <RichTextEditor.Control
              title="Back Up"
              onClick={
                () => {
                  backupDoc(docIndex)
                }
              }
            >
              <p style={{ fontSize: '0.7em', padding: '1em' }}>Back Up</p>
              {/*<i className="fa-solid fa-box" style={{}}></i>*/}
            </RichTextEditor.Control>
          </RichTextEditor.ControlsGroup>
          {editor && (
            <BubbleMenu editor={editor}>
              <RichTextEditor.ControlsGroup>
                {
                  showReview && (
                    <RichTextEditor.Control
                      onClick={handleReview}
                    >
                      <Text fw={700} style={{ padding: '1em' }}>Review</Text>
                    </RichTextEditor.Control>

                  )
                }
                <RichTextEditor.Control
                  onClick={handleCapture}
                >
                  <Text fw={700} style={{ padding: '1em' }}>Capture</Text>
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