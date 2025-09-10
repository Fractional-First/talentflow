import { useState } from "react"
import { toast } from "@/hooks/use-toast"
import { ProfileData } from "@/components/create-profile/types"

export const useDocumentUpload = () => {
  const [profile, setProfile] = useState<ProfileData>({
    docs: [],
    links: [],
  })

  const handleLinkedInUpload = (file: File) => {
    setProfile((prev) => ({ ...prev, linkedin: file }))
    toast({
      title: "LinkedIn PDF uploaded",
      description: "Your LinkedIn profile PDF was successfully uploaded.",
    })
  }

  const handleResumeUpload = (file: File) => {
    setProfile((prev) => ({ ...prev, resume: file }))
    toast({
      title: "Resume uploaded",
      description: "Your resume was successfully uploaded.",
    })
  }

  const handleLinkedInUrlSubmit = (linkedinUrl: string) => {
    setProfile((prev) => ({ ...prev, linkedinUrl }))
    toast({
      title: "LinkedIn URL added",
      description: "Your LinkedIn profile URL has been added.",
    })
  }

  const removeProfileDocument = (type: "linkedin" | "resume") => {
    setProfile((prev) => {
      const newProfile = { ...prev }
      delete newProfile[type]
      return newProfile
    })

    toast({
      title: "Document removed",
      description: "The profile document has been removed.",
    })
  }

  // Supporting docs/links handlers
  const addSupportingDocument = (
    title: string,
    file: File,
    description: string
  ) => {
    setProfile((prev) => ({
      ...prev,
      docs: [...prev.docs, { title, file, description }],
    }))
  }

  const addSupportingLink = (title: string, url: string) => {
    setProfile((prev) => ({
      ...prev,
      links: [...prev.links, { title, link: url }],
    }))
  }

  const removeSupportingDoc = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      docs: prev.docs.filter((_, i) => i !== index),
    }))
    toast({
      title: "Item removed",
      description: "The document has been removed from your profile.",
    })
  }

  const removeSupportingLink = (index: number) => {
    setProfile((prev) => ({
      ...prev,
      links: prev.links.filter((_, i) => i !== index),
    }))
    toast({
      title: "Item removed",
      description: "The link has been removed from your profile.",
    })
  }

  const hasRequiredDocuments =
    profile.linkedin || profile.linkedinUrl || profile.resume

  return {
    profile,
    handleLinkedInUpload,
    handleResumeUpload,
    handleLinkedInUrlSubmit,
    removeProfileDocument,
    hasRequiredDocuments,
    addSupportingDocument,
    addSupportingLink,
    removeSupportingDoc,
    removeSupportingLink,
  }
}
