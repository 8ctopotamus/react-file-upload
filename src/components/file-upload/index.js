import { useState, useRef } from 'react'

const DEFAULT_MAX_FILE_SIZE_IN_BYTES = 500000
const KILO_BYTES_PER_BYTE = 1000

const convertBytesToKB = bytes => Math.round(bytes / KILO_BYTES_PER_BYTE)

const FileUpload = ({
  label,
  maxFileSizeInBytes = DEFAULT_MAX_FILE_SIZE_IN_BYTES,
  updateFilesCb,
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
  const [files, setFiles] = useState({}) 

  const fileInputRef = useRef()

  return (
    <>
      <div>
        <label>{label}</label>
        <p>Drag and drop your files anywhere or</p>
        <button type="button">
          <span>Upload File{multiple && 's'}</span>
        </button>
        <input
          type="file"
          ref={fileInputRef}
          title=""
          value=""
          {...props}
        />
      </div>
      <div>
        <span>To Upload</span>
        <section>
          {Object.keys(files).map((fileName, i) => {
            const file = files[fileName]
            const isImgFile = file.type.split('/')[0] === 'image'
            return (
              <section key={fileName}>
                <div>
                  {isImgFile && (
                    <img 
                      src={URL.createObjectURL(file)}
                      alt={`File preview ${i}`}
                    />
                  )}
                </div>
              </section>
            )
          })}
        </section>
      </div>
    </>
  )
}

export default FileUpload