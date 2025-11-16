import React, { useRef } from "react";
import {  Controller } from "react-hook-form";
import { Editor } from "@tinymce/tinymce-react";
   


    function MyTextEditor({ name, control,  error }) {
      const editorRef = useRef(null);
   
      return (
        <>
        {
            control && (
                  <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <Editor
            apiKey='asw6b7wo37c1xxj2vsoayc6cmn5icpvyd1h4wfq5v3w2uigv'
 // Get this from tiny.cloud
            onInit={(_evt, editor) => (editorRef.current = editor)}
            
            value={field.value || ""}
            onEditorChange={field.onChange}
            init={{
              height: 300,
              menubar: false,
              plugins: [
                'advlist',
                'link', 'lists'
              ],
              toolbar:
                'undo redo | formatselect | bold italic backcolor | \
                alignleft aligncenter alignright alignjustify | link unlink\
                bullist numlist outdent indent | removeformat | help',
            }}
          />
        )}/>
            )
        }
      
          
        </>
      )
    }

    export default MyTextEditor;