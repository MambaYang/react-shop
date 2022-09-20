import React, { Component } from "react"
import { EditorState, convertToRaw, ContentState } from "draft-js"
import { Editor } from "react-draft-wysiwyg"
import draftToHtml from "draftjs-to-html"
import htmlToDraft from "html-to-draftjs"
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

export default class RichTextEditor extends Component {
    state = {
        editorState: EditorState.createEmpty(),
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }

    getRichText = () => {
        return draftToHtml(
            convertToRaw(this.state.editorState.getCurrentContent())
        )
    }
    setRichText = (html) => {
        const contentBlock = htmlToDraft(html)
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(
                contentBlock.contentBlocks
            )
            const editorState = EditorState.createWithContent(contentState)
            this.setState({
                editorState,
            })
        }
    }

    render() {
        const { editorState } = this.state
        return (
            <div>
                <Editor
                    editorState={editorState}
                    // wrapperClassName="demo-wrapper"     最外侧容器的样式
                    // editorClassName="demo-editor"        编辑区的样式
                    editorStyle={{
                        border: "1px solid black",
                        padding: "5px",
                        lineHeight: "initial",
                        minHeight: " 200px",
                        overflow: "auto",
                    }}
                    onEditorStateChange={this.onEditorStateChange}
                />
            </div>
        )
    }
}
