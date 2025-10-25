import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  FileText,
  Link,
  Plus,
  Trash2,
  Paperclip,
  HelpCircle,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface SupportingDocsSectionProps {
  docs: Array<{ title: string; file: File }>
  links: Array<{ title: string; link: string }>
  addDocument: (title: string, file: File, description: string) => void
  addLink: (title: string, url: string) => void
  removeDoc: (index: number) => void
  removeLink: (index: number) => void
}

export const SupportingDocsSection = ({
  docs,
  links,
  addDocument,
  addLink,
  removeDoc,
  removeLink,
}: SupportingDocsSectionProps) => {
  const [showForm, setShowForm] = useState(false)
  const [type, setType] = useState<"document" | "link">("document")
  const [title, setTitle] = useState("")
  const [file, setFile] = useState<File | null>(null)
  const [url, setUrl] = useState("")
  const [description, setDescription] = useState("")
  const [isDragOver, setIsDragOver] = useState(false)

  const validateAndSetFile = (selectedFile: File) => {
    // Check file type
    const allowedTypes = ['.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx', '.png', '.jpg', '.jpeg']
    const fileExtension = `.${selectedFile.name.split('.').pop()?.toLowerCase()}`
    
    if (!allowedTypes.includes(fileExtension)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a PDF, DOCX, PPTX, XLSX, or common image format.",
        variant: "destructive",
      })
      return false
    }

    // Check file size (10MB)
    const maxSize = 10 * 1024 * 1024
    if (selectedFile.size > maxSize) {
      toast({
        title: "File too large",
        description: "File size must be less than 10MB.",
        variant: "destructive",
      })
      return false
    }

    setFile(selectedFile)
    return true
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const droppedFiles = e.dataTransfer.files
    if (droppedFiles && droppedFiles.length > 0) {
      validateAndSetFile(droppedFiles[0])
    }
  }

  const handleAdd = () => {
    if (!title) {
      toast({
        title: "Title required",
        description: "Please provide a title.",
        variant: "destructive",
      })
      return
    }
    if (type === "document") {
      if (!file) {
        toast({
          title: "Please select a file",
          description: "You must upload a document before adding it.",
          variant: "destructive",
        })
        return
      }
      addDocument(title, file, description)
    } else {
      if (!url) {
        toast({
          title: "Please enter a URL",
          description: "You must provide a valid URL for your link.",
          variant: "destructive",
        })
        return
      }
      addLink(title, url)
    }
    setTitle("")
    setFile(null)
    setUrl("")
    setDescription("")
    setShowForm(false)
    toast({
      title: "Added successfully",
      description: `Your ${type} has been added to your profile.`,
    })
  }

  return (
    <div className="border rounded-lg p-6 mt-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-start gap-3 mb-4 sm:mb-0">
          <div className="bg-primary/10 p-3 rounded-full flex-shrink-0">
            <Paperclip className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-base sm:text-lg mb-1">
              Supporting Documents (Optional)
            </h3>
            <p className="text-sm text-muted-foreground">
              Add publications, news articles, portfolios, or other resources
              that showcase your work
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={() => setShowForm(!showForm)}
          type="button"
          className="w-full sm:w-auto flex-shrink-0"
        >
          {showForm ? "Hide Form" : "Add Files"}
        </Button>
      </div>
      <Alert
        className="mb-4 bg-card"
        style={{ borderColor: "#BFE3DD" }}
      >
        <div className="flex gap-2">
          <div className="mt-0.5">
            <HelpCircle className="h-5 w-5 text-[#449889]" />
          </div>
          <div>
            <AlertTitle
              className="mb-1 font-semibold"
              style={{ color: "#449889" }}
            >
              Enhanced Profile Quality
            </AlertTitle>
            <AlertDescription className="text-sm" style={{ color: "#1A1A1A" }}>
              The more supporting materials you provide, the stronger and more
              complete your profile will be. These additions help us present a
              well-rounded and accurate representation of your professional
              expertise.
            </AlertDescription>
          </div>
        </div>
      </Alert>
      {showForm && (
        <Card className="border border-border/60 mb-6">
          <CardContent className="p-6 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium">Add New Supporting Material</h3>
              <div className="flex gap-2">
                <Button
                  variant={type === "document" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setType("document")}
                  type="button"
                >
                  <FileText className="h-4 w-4 mr-1" /> Document
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="doc-title">Title*</Label>
                <Input
                  id="doc-title"
                  placeholder="Document Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>
              {type === "document" ? (
                <div className="md:col-span-2">
                  <Label htmlFor="doc-upload">Upload File*</Label>
                  <div 
                    className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                      isDragOver 
                        ? 'border-primary bg-primary/5' 
                        : 'border-muted'
                    }`}
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragEnter}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                  >
                    {file ? (
                      <div className="flex flex-col items-center space-y-2">
                        <div className="bg-primary/10 p-3 rounded-full">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <p className="text-sm font-medium">{file.name}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setFile(null)}
                          type="button"
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center space-y-3">
                        <div className="bg-muted/50 p-3 rounded-full">
                          <Plus className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm font-medium mb-1">Drag and drop your file here</p>
                          <p className="text-xs text-muted-foreground mb-3">
                            Supports PDF, DOCX, PPTX, XLSX, and common image formats up to 10MB
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => document.getElementById("doc-upload")?.click()}
                          type="button"
                        >
                          Select File
                        </Button>
                        <input
                          id="doc-upload"
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
                          onChange={handleFileChange}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div>
                  <Label htmlFor="doc-url">URL*</Label>
                  <Input
                    id="doc-url"
                    placeholder="https://"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div>
              <Label htmlFor="doc-description">Description (Optional)</Label>
              <Textarea
                id="doc-description"
                placeholder="Briefly describe this resource..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="resize-none"
              />
            </div>
            <div className="flex justify-end">
              <Button onClick={handleAdd} type="button">
                <Plus className="h-4 w-4 mr-1" />
                Add {type === "document" ? "Document" : "Link"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      {docs.length > 0 && (
        <div className="space-y-3 mt-6">
          <h3 className="font-medium">Added Documents</h3>
          <div className="space-y-3">
            {docs.map((doc, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md border border-border/60 bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{doc.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {doc.file.name}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeDoc(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
