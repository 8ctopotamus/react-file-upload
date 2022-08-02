import { useState } from "react"
import FileUpload from "./components/file-upload"

function App() {
  const [newUserInfo, setNewUserInfo] = useState({
    profileImages: []
  })

  const updateUploadedFiles = (files) => setNewUserInfo({ ...newUserInfo, profileImages: files })

  const handleSubmit = e => {
    e.preventDefault()
    console.log(newUserInfo)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FileUpload 
        label="Upload files"
        updateFilesCb={updateUploadedFiles}
      />
      <button type="submit">Create New User</button>
    </form>
  );
}

export default App;
