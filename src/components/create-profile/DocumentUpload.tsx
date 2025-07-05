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
    <div className={`border rounded-lg p-6 ${className}`}>
      <div className="flex items-center mb-4">
        <div className="bg-primary/10 p-3 rounded-full mr-3">{icon}</div>
        <div>
          <h3 className="font-medium">{title}</h3>
          <div className="text-sm text-muted-foreground">{description}</div>
        </div>
      </div>
      <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
        {file ? (
          <div className="flex flex-col items-center">
            <div className="bg-primary/10 p-3 rounded-full mb-3">
              <File className="h-6 w-6 text-primary" />
            </div>
            <p className="mb-1 font-medium">File uploaded successfully</p>
            <p className="text-sm text-muted-foreground mb-3">{file.name}</p>
            <div className="flex gap-2">
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
              >
                Replace
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemove}
                className="text-red-600 hover:text-red-700 hover:bg-red-100"
                type="button"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="bg-muted/50 p-3 rounded-full mb-3">
              <Upload className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="mb-1 font-medium">Drag and drop your file here</p>
            <p className="text-sm text-muted-foreground mb-3">
              Supports {accept.replace(/\./g, "").toUpperCase()}, up to{" "}
              {maxSize}MB
            </p>
            <div>
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
