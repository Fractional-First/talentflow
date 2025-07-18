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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
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
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-primary/10 p-3 rounded-full mr-3">
            <Paperclip className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">
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
        >
          {showForm ? "Hide Form" : "Add Files"}
        </Button>
      </div>
      <Alert
        className="mb-4"
        style={{ background: "#E6F4F2", borderColor: "#BFE3DD" }}
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
                {/*
                <Button
                  variant={type === "link" ? "secondary" : "outline"}
                  size="sm"
                  onClick={() => setType("link")}
                  type="button"
                >
                  <Link className="h-4 w-4 mr-1" /> Link
                </Button>
                */}
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
                <div>
                  <Label htmlFor="doc-upload">Upload File*</Label>
                  <div className="mt-1 flex items-center">
                    <Button
                      variant="outline"
                      onClick={() =>
                        document.getElementById("doc-upload")?.click()
                      }
                      type="button"
                      className="w-full justify-start text-muted-foreground"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {file ? file.name : "Select File"}
                    </Button>
                    <input
                      id="doc-upload"
                      type="file"
                      className="hidden"
                      accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg"
                      onChange={handleFileChange}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports PDF, DOCX, PPTX, and common image formats up to
                    10MB
                  </p>
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
      {docs.length > 0 /*|| links.length > 0*/ && (
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
            {/*
            {links.map((link, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-md border border-border/60 bg-background"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-md bg-primary/10">
                    <Link className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{link.title}</p>
                    <p className="text-xs text-primary truncate max-w-[200px] md:max-w-[300px]">
                      {link.link}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeLink(index)}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  type="button"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            */}
          </div>
        </div>
      )}
    </div>
  )
}
