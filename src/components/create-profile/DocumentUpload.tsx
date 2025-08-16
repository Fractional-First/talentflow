
import { File, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentUploadProps {
  title: string
  description: string | React.ReactNode
  icon?: React.ReactNode
  file?: File
  onUpload: (file: File) => void
  onRemove: () => void
  accept?: string
  maxSize?: number
  linkedinInstructionsComponent?: () => React.ReactNode 
  className?: string
}

export const DocumentUpload = ({
  title,
  description,
  icon = <File className="h-6 w-6 text-primary" />,
  file,
  onUpload,
  onRemove,
  accept = ".pdf,.doc,.docx",
  maxSize = 5,
  linkedinInstructionsComponent = null,
  className,

}: DocumentUploadProps) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      if (file.size > maxSize * 1024 * 1024) {
        // Handle file size error
        return
      }
      onUpload(file)
    }
  }

  return (
    <div className={`border rounded-lg p-4 sm:p-6 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center mb-4 sm:mb-6">
        <div className="flex items-center mb-3 sm:mb-0">
          <div className="bg-primary/10 p-3 rounded-full mr-3 flex-shrink-0">{icon}</div>
          <div className="flex-1">
            <h3 className="font-medium text-base sm:text-lg mb-1">{title}</h3>
            <div className="text-sm text-muted-foreground leading-relaxed">{description}</div>
          </div>
        </div>
      </div>
      
      {linkedinInstructionsComponent && (
        <div className="mb-4 sm:mb-6">{linkedinInstructionsComponent()}</div>
      )}
      
      <div className="border-2 border-dashed border-muted rounded-lg p-6 sm:p-8 text-center">
        {file ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-primary/10 p-4 rounded-full mb-2">
              <File className="h-8 w-8 sm:h-6 sm:w-6 text-primary" />
            </div>
            <div className="text-center">
              <p className="mb-1 font-medium text-base sm:text-sm">File uploaded successfully</p>
              <p className="text-sm text-muted-foreground mb-4 break-all px-2">{file.name}</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  document
                    .getElementById(
                      `upload-${title.toLowerCase().replace(/\s+/g, "-")}`
                    )
                    ?.click()
                }
                type="button"
                className="min-h-[44px] w-full sm:w-auto"
              >
                Replace File
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-100 min-h-[44px] w-full sm:w-auto"
                type="button"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-muted/50 p-4 rounded-full mb-2">
              <Upload className="h-8 w-8 sm:h-6 sm:w-6 text-muted-foreground" />
            </div>
            <div className="text-center px-2">
              <p className="mb-2 font-medium text-base sm:text-sm">Drag and drop your file here</p>
              <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                Supports {accept.replace(/\./g, "").toUpperCase()}, up to{" "}
                {maxSize}MB
              </p>
            </div>
            <div className="w-full sm:w-auto">
              <label
                htmlFor={`upload-${title.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    document
                      .getElementById(
                        `upload-${title.toLowerCase().replace(/\s+/g, "-")}`
                      )
                      ?.click()
                  }
                  type="button"
                  className="min-h-[48px] w-full sm:w-auto px-6"
                >
                  Select File
                </Button>
                <input
                  id={`upload-${title.toLowerCase().replace(/\s+/g, "-")}`}
                  type="file"
                  className="hidden"
                  accept={accept}
                  onChange={handleFileChange}
                />
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
