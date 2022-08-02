import { useState, useRef, useEffect } from 'react'
import { FaTrash, FaUpload } from 'react-icons/fa'
import {
  FileUploadContainer,
  FormField,
  DragDropText,
  UploadFileBtn,
  FilePreviewContainer,
  ImagePreview,
  PreviewContainer,
  PreviewList,
  FileMetaData,
  RemoveFileIcon,
  InputLabel
} from "./styles"

const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000
const KILO_BYTES_PER_BYTE = 1000

const convertBytesToKB = bytes => Math.round(bytes / KILO_BYTES_PER_BYTE)

const FileUpload = ({
  label,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  updateFilesCb = files => console.log(files),
  multiple = true,
  ...props
}) => {
  {/* 
    NOTE: files state will look like this:
    {
      "file1.png": File,
      "file2.png": File
    }
  */}
  const [isDragging, setIsDragging] = useState(false)
  const [files, setFiles] = useState({}) 

  const fileInputRef = useRef()

  const handleUploadBtnClick = () => {
    fileInputRef.current.click()
  }

  const handleNewFileUpload = e => {
    const { files: newFiles } = e.target
    if (newFiles.length) {
      const updatedFiles = addNewFiles(newFiles)
      setFiles(updatedFiles)
      callUpdateFilesCb(updatedFiles)
    }
  }

  const addNewFiles = newFiles => {
    for (const file of newFiles) {
      if (file.size <= maxFileSizeInBytes) {
        if (!multiple) {
          return { file }
        }
        files[file.name] = file
      }
    }
    return { ...files }
  }

  const callUpdateFilesCb = files => {
    const filesArray = convertNestedObjectToArray(files)
    updateFilesCb(filesArray)
  }

  const convertNestedObjectToArray = nestedObj => Object.keys(nestedObj).map(key => nestedObj[key])

  const removeFile = fileName => {
    delete files[fileName]
    const updatedFiles = { ...files }
    setFiles(updatedFiles)
    callUpdateFilesCb(updatedFiles)
  }

  return (
    <>
      <FileUploadContainer isDragging={isDragging}>
        <InputLabel>{label}</InputLabel>
        <DragDropText>Drag and drop your files anywhere or</DragDropText>
        <UploadFileBtn  
          onClick={handleUploadBtnClick}
          type="button"
        >
          <FaUpload />
          <span>Upload File{multiple && 's'}</span>
        </UploadFileBtn >
        <FormField
          type="file"
          ref={fileInputRef}
          title=""
          value=""
          onChange={handleNewFileUpload}
          onDragEnter={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onDragLeave={() => setIsDragging(false)}
          onDrop={() => setIsDragging(false)}
          multiple={multiple}
          {...props}
        />
      </FileUploadContainer>
      <FilePreviewContainer>
        <span>To Upload</span>
        <PreviewList>
          {Object.keys(files).map((fileName, i) => {
            const file = files[fileName]
            const isImgFile = file.type.split('/')[0] === 'image'
            return (
              <PreviewContainer key={fileName}>
                <div>
                  {isImgFile && (
                    <ImagePreview 
                      src={URL.createObjectURL(file)}
                      alt={`File preview ${i}`}
                    />
                  )}
                  <FileMetaData isImageFile={isImgFile}>
                    <span>{file.name}</span>
                    <aside>
                      <span>{convertBytesToKB(file.size)}</span>
                      <FaTrash onClick={() => removeFile(fileName)} />
                    </aside>
                  </FileMetaData>
                </div>
              </PreviewContainer >
            )
          })}
        </PreviewList>
      </FilePreviewContainer>
    </>
  )
}

export default FileUpload