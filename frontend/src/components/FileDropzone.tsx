import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, FileText, X } from 'lucide-react'
import clsx from 'clsx'

interface FileDropzoneProps {
  onFilesSelected: (files: File[]) => void
  selectedFiles: File[]
  onRemoveFile: (index: number) => void
  isUploading: boolean
  maxFiles?: number
}

export default function FileDropzone({
  onFilesSelected,
  selectedFiles,
  onRemoveFile,
  isUploading,
  maxFiles = 10,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      onFilesSelected(acceptedFiles)
    },
    [onFilesSelected]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles,
    disabled: isUploading,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={clsx(
          'relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200',
          isDragActive
            ? 'border-osita-500 bg-osita-500/5'
            : 'border-white/10 hover:border-white/20 hover:bg-white/[0.02]',
          isUploading && 'opacity-50 cursor-not-allowed'
        )}
      >
        <input {...getInputProps()} />
        
        <motion.div
          animate={{ scale: isDragActive ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center gap-4"
        >
          <div
            className={clsx(
              'w-16 h-16 rounded-2xl flex items-center justify-center transition-colors',
              isDragActive ? 'bg-osita-500/20' : 'bg-white/5'
            )}
          >
            <Upload
              className={clsx(
                'w-8 h-8 transition-colors',
                isDragActive ? 'text-osita-400' : 'text-gray-500'
              )}
            />
          </div>

          <div>
            <p className="text-white font-medium mb-1">
              {isDragActive
                ? 'Drop your PDF files here'
                : 'Drag & drop PDF files here'}
            </p>
            <p className="text-sm text-gray-500">
              or click to browse (max {maxFiles} files)
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <FileText className="w-3.5 h-3.5" />
              PDF only
            </span>
            <span>Max 50MB per file</span>
          </div>
        </motion.div>
      </div>

      {/* Selected Files */}
      <AnimatePresence>
        {selectedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2"
          >
            <p className="text-sm text-gray-400">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} selected
            </p>
            
            <div className="space-y-2">
              {selectedFiles.map((file, index) => (
                <motion.div
                  key={`${file.name}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-coral-500/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-coral-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[300px]">
                        {file.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      onRemoveFile(index)
                    }}
                    disabled={isUploading}
                    className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

