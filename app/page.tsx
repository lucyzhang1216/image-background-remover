'use client'

import { useState, useCallback, useRef } from 'react'

type ProcessingStatus = 'idle' | 'processing' | 'success' | 'error'

export default function Home() {
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [resultImage, setResultImage] = useState<string | null>(null)
  const [status, setStatus] = useState<ProcessingStatus>('idle')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api/remove-bg'

  // Validate image file
  const validateFile = (file: File): string | null => {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      return 'Please upload JPG, PNG, or WebP images only.'
    }
    if (file.size > 10 * 1024 * 1024) {
      return 'File size must be less than 10MB.'
    }
    return null
  }

  // Convert file to base64
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }

  // Process image
  const processImage = async (file: File) => {
    const error = validateFile(file)
    if (error) {
      setErrorMessage(error)
      setStatus('error')
      return
    }

    try {
      setStatus('processing')
      setErrorMessage('')
      
      // Show original image
      const base64 = await fileToBase64(file)
      setOriginalImage(base64)
      
      // Call API
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: base64 }),
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        throw new Error(data.error)
      }

      setResultImage(data.result)
      setStatus('success')
    } catch (err) {
      setErrorMessage('Error processing image: ' + (err as Error).message)
      setStatus('error')
    }
  }

  // Handle file drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const files = e.dataTransfer.files
    if (files.length > 0) {
      processImage(files[0])
    }
  }, [])

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  // Handle drag leave
  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processImage(files[0])
    }
  }

  // Handle click to upload
  const handleClick = () => {
    fileInputRef.current?.click()
  }

  // Handle paste
  const handlePaste = useCallback((e: ClipboardEvent) => {
    const items = e.clipboardData?.items
    if (items) {
      for (let item of items) {
        if (item.type.startsWith('image/')) {
          const file = item.getAsFile()
          if (file) {
            processImage(file)
            break
          }
        }
      }
    }
  }, [])

  // Attach paste listener
  if (typeof window !== 'undefined') {
    window.addEventListener('paste', handlePaste)
  }

  // Download image
  const handleDownload = () => {
    if (!resultImage) return
    const link = document.createElement('a')
    link.download = 'removed-bg-' + Date.now() + '.png'
    link.href = resultImage
    link.click()
  }

  // Copy to clipboard
  const handleCopy = async () => {
    if (!resultImage) return
    try {
      const response = await fetch(resultImage)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ])
      alert('Copied to clipboard!')
    } catch {
      alert('Failed to copy. Please right-click and save the image.')
    }
  }

  // Reset
  const handleReset = () => {
    setOriginalImage(null)
    setResultImage(null)
    setStatus('idle')
    setErrorMessage('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6 sm:p-8 text-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
            🖼️ Image Background Remover
          </h1>
          <p className="text-white/90 text-sm sm:text-base">
            Remove image backgrounds online for free - No registration required
          </p>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8">
          {/* Upload Area */}
          {status === 'idle' && (
            <div
              className={`border-3 border-dashed rounded-xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
              }`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={handleClick}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="text-5xl mb-4">📁</div>
              <p className="text-gray-600 mb-2">
                <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
              </p>
              <p className="text-gray-400 text-sm">
                Paste image (Ctrl+V) supported
              </p>
              <p className="text-gray-400 text-xs mt-2">
                Supports: JPG, PNG, WebP (max 10MB)
              </p>
            </div>
          )}

          {/* Processing */}
          {status === 'processing' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Processing image... Please wait</p>
            </div>
          )}

          {/* Error */}
          {status === 'error' && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
              <p className="text-red-600 text-center">{errorMessage}</p>
              <button
                onClick={handleReset}
                className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
              >
                Try Again
              </button>
            </div>
          )}

          {/* Result */}
          {status === 'success' && (
            <div>
              {/* Comparison */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="text-center">
                  <h3 className="text-gray-600 font-medium mb-2">Original</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    {originalImage && (
                      <img src={originalImage} alt="Original" className="w-full h-auto" />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <h3 className="text-gray-600 font-medium mb-2">Background Removed</h3>
                  <div className="border border-gray-200 rounded-lg overflow-hidden checkerboard">
                    {resultImage && (
                      <img src={resultImage} alt="Result" className="w-full h-auto" />
                    )}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={handleDownload}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  📥 Download PNG
                </button>
                <button
                  onClick={handleCopy}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  📋 Copy to Clipboard
                </button>
                <button
                  onClick={handleReset}
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  🔄 Process Another
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 text-center border-t border-gray-200">
          <p className="text-gray-400 text-xs">
            🔒 Privacy First: Images are processed and deleted immediately. We don&apos;t store any data.
          </p>
        </div>
      </div>
    </main>
  )
}
