'use client'

import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, FileText, Image, FileSpreadsheet, Loader2, CheckCircle, XCircle } from 'lucide-react'

interface FileUploadProps {
  onDataAnalyzed: (data: any) => void
}

export default function FileUpload({ onDataAnalyzed }: FileUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState<{
    type: 'idle' | 'success' | 'error'
    message: string
  }>({ type: 'idle', message: '' })

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return

    const file = acceptedFiles[0]
    setUploading(true)
    setStatus({ type: 'idle', message: `Analyzing ${file.name}...` })

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/analyze-file', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Failed to analyze file')
      }

      const result = await response.json()

      setStatus({
        type: 'success',
        message: `Successfully analyzed ${file.name}! Dashboard updated.`,
      })

      // Pass analyzed data to parent
      onDataAnalyzed(result.data)

      // Reset status after 3 seconds
      setTimeout(() => {
        setStatus({ type: 'idle', message: '' })
      }, 3000)

    } catch (error) {
      setStatus({
        type: 'error',
        message: `Failed to analyze ${file.name}. Please try again.`,
      })
    } finally {
      setUploading(false)
    }
  }, [onDataAnalyzed])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'text/csv': ['.csv'],
      'application/pdf': ['.pdf'],
      'image/png': ['.png'],
      'image/jpeg': ['.jpg', '.jpeg'],
    },
    maxFiles: 1,
    disabled: uploading,
  })

  return (
    <div className="mb-8">
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive ? 'border-accent-green bg-accent-green/10' : 'border-grid hover:border-accent-green/50'}
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />

        <div className="flex flex-col items-center gap-4">
          {uploading ? (
            <Loader2 className="w-12 h-12 text-accent-green animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-accent-green" />
          )}

          <div>
            <h3 className="text-lg font-semibold text-text-primary mb-2">
              {uploading ? 'Analyzing...' : 'Upload Data Files'}
            </h3>
            <p className="text-text-secondary text-sm">
              {isDragActive
                ? 'Drop file here...'
                : 'Drag & drop or click to upload Excel, PDF, or PNG files'}
            </p>
          </div>

          <div className="flex gap-4 text-text-secondary">
            <div className="flex items-center gap-1">
              <FileSpreadsheet className="w-4 h-4" />
              <span className="text-xs">Excel</span>
            </div>
            <div className="flex items-center gap-1">
              <FileText className="w-4 h-4" />
              <span className="text-xs">PDF</span>
            </div>
            <div className="flex items-center gap-1">
              <Image className="w-4 h-4" />
              <span className="text-xs">PNG/JPG</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status message */}
      {status.message && (
        <div className={`
          mt-4 p-4 rounded-lg flex items-center gap-3
          ${status.type === 'success' ? 'bg-accent-green/10 border border-accent-green' : ''}
          ${status.type === 'error' ? 'bg-danger-red/10 border border-danger-red' : ''}
          ${status.type === 'idle' ? 'bg-card border border-grid' : ''}
        `}>
          {status.type === 'success' && <CheckCircle className="w-5 h-5 text-accent-green" />}
          {status.type === 'error' && <XCircle className="w-5 h-5 text-danger-red" />}
          {status.type === 'idle' && uploading && <Loader2 className="w-5 h-5 text-accent-green animate-spin" />}

          <span className={`text-sm ${
            status.type === 'success' ? 'text-accent-green' :
            status.type === 'error' ? 'text-danger-red' :
            'text-text-secondary'
          }`}>
            {status.message}
          </span>
        </div>
      )}
    </div>
  )
}
