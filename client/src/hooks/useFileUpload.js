import { useState } from 'react'
import { studentApi } from '../api/studentApi'

export function useFileUpload() {
  const [uploading, setUploading] = useState(false)

  async function upload(file) {
    setUploading(true)
    try {
      return await studentApi.uploadDocument({ fileName: file.name })
    } finally {
      setUploading(false)
    }
  }

  return { upload, uploading }
}
