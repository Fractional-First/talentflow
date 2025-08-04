import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"
import { useState } from "react"
import { supabase } from "@/integrations/supabase/client"
import { ProfileData } from "@/types/profile"
import { BasicInfoSection } from "@/components/edit-profile/BasicInfoSection"
import { EditableArraySection } from "@/components/edit-profile/EditableArraySection"
import { EditableTextSection } from "@/components/edit-profile/EditableTextSection"
import { FunctionalSkillsSection } from "@/components/edit-profile/FunctionalSkillsSection"
import { PersonasSection } from "@/components/edit-profile/PersonasSection"
import { SuperpowersSection } from "@/components/edit-profile/SuperpowersSection"
import ProfilePictureUpload from "@/components/ProfilePictureUpload"
import { Spinner } from "@/components/ui/spinner"
import NotFound from "./NotFound"

const PublicProfile = () => {
  const { userId } = useParams<{ userId: string }>()
  const [personasActiveTab, setPersonasActiveTab] = useState("0")

  const { data: profileData, isLoading, error } = useQuery({
    queryKey: ["public-profile", userId],
    queryFn: async (): Promise<ProfileData | null> => {
      if (!userId) throw new Error("No user ID provided")

      const { data, error } = await supabase
        .from("profiles")
        .select("profile_data")
        .eq("id", userId)
        .single()

      if (error) {
        console.error("Error loading public profile:", error)
        throw error
      }

      return data?.profile_data as ProfileData || null
    },
    enabled: !!userId,
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (error || !profileData) {
    return <NotFound />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header matching site style */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <a href="https://fractionalfirst.com">
              <img 
                src="/lovable-uploads/daefe55a-8953-4582-8fc8-12a66755ac2a.png" 
                alt="Fractional First" 
                className="h-12 w-auto cursor-pointer"
              />
            </a>
          </div>
        </div>
      </header>
      
      <div className="max-w-6xl mx-auto space-y-6 p-6">
        {/* Main Layout - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image and Basic Info */}
            <div className="text-center">
              <div className="relative mb-4 inline-block">
                <ProfilePictureUpload
                  currentImage={profileData?.profilePicture}
                  userName={profileData?.name || "User"}
                  onImageUpdate={() => {}} // No-op for read-only
                  readOnly={true}
                />
              </div>

              <div className="space-y-2">
                <BasicInfoSection
                  content=""
                  name={profileData?.name || ""}
                  role={profileData?.role || ""}
                  location={profileData?.location || ""}
                  isEditing={false}
                  onEditToggle={() => {}} // No-op for read-only
                  onChange={() => {}} // No-op for read-only
                  readOnly={true}
                />
              </div>
            </div>

            {/* Description */}
            <EditableTextSection
              content=""
              title="Description"
              value={profileData?.summary || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="Description not available"
              className="bg-white"
              headerClassName=""
              labelClassName="text-base font-semibold"
              readOnly={true}
            />

            {/* Key Roles */}
            <EditableArraySection
              content=""
              title="Key Roles"
              items={profileData.highlights || []}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onChange={() => {}} // No-op for read-only
              placeholder="Key role"
              addLabel="Add Role"
              displayType="bullets"
              readOnly={true}
            />

            {/* Focus Areas */}
            <EditableArraySection
              content=""
              title="Focus Areas"
              items={profileData.focus_areas || []}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onChange={() => {}} // No-op for read-only
              placeholder="Focus area"
              addLabel="Add Area"
              readOnly={true}
            />

            {/* Industries */}
            <EditableArraySection
              content=""
              title="Industries"
              items={profileData.industries || []}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onChange={() => {}} // No-op for read-only
              placeholder="Industry"
              addLabel="Add Industry"
              readOnly={true}
            />

            {/* Geographical Coverage */}
            <EditableArraySection
              content=""
              title="Geographical Coverage"
              items={profileData.geographical_coverage || []}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onChange={() => {}} // No-op for read-only
              placeholder="Region"
              addLabel="Add Region"
              readOnly={true}
            />

            {/* Stage */}
            <EditableArraySection
              content=""
              title="Stage"
              items={profileData.stage_focus || []}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onChange={() => {}} // No-op for read-only
              placeholder="Stage"
              addLabel="Add Stage"
              readOnly={true}
            />

            {/* Personal Interests */}
            <EditableArraySection
              content=""
              title="Personal Interests"
              items={profileData.personal_interests || []}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onChange={() => {}} // No-op for read-only
              placeholder="Interest"
              addLabel="Add Interest"
              readOnly={true}
            />

            {/* Certifications */}
            <EditableArraySection
              content=""
              title="Certifications"
              items={profileData.certifications || []}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onChange={() => {}} // No-op for read-only
              placeholder="Certification"
              addLabel="Add Certification"
              readOnly={true}
            />
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meet Section */}
            <EditableTextSection
              content=""
              title={`Meet ${profileData?.name?.split(" ")[0] || "Professional"}`}
              value={profileData?.meet_them || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="Introduction not available"
              bgColorClass="bg-teal-600"
              textColorClass="text-white"
              headerClassName="bg-teal-600 text-white"
              labelClassName="text-lg font-semibold"
              readOnly={true}
            />

            {/* Personas Section */}
            <PersonasSection
              content=""
              personas={profileData.personas || []}
              personaEditStates={{}}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onPersonaLocalUpdate={() => {}} // No-op for read-only
              onAddPersona={() => {}} // No-op for read-only
              onRemovePersona={() => {}} // No-op for read-only
              activeTab={personasActiveTab}
              onActiveTabChange={setPersonasActiveTab}
              readOnly={true}
            />

            {/* Superpowers Section */}
            <SuperpowersSection
              content=""
              superpowers={profileData.superpowers || []}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onSuperpowersChange={() => {}} // No-op for read-only
              readOnly={true}
            />

            {/* Sweet Spot Section */}
            <EditableTextSection
              content=""
              title="Sweet Spot"
              value={profileData?.sweetspot || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="Sweet spot not available"
              className="bg-white"
              headerClassName="bg-teal-600 text-white"
              labelClassName="text-lg font-semibold"
              readOnly={true}
            />

            {/* Functional Skills */}
            <FunctionalSkillsSection
              content=""
              functionalSkills={profileData.functional_skills || {}}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onFunctionalSkillsChange={() => {}} // No-op for read-only
              readOnly={true}
            />

            {/* User Manual */}
            <EditableTextSection
              content=""
              title={`${
                profileData?.name?.split(" ")[0] || "Professional"
              }'s User Manual`}
              value={profileData?.user_manual || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="User manual not available"
              className="bg-white"
              headerClassName="bg-teal-600 text-white"
              labelClassName="text-lg font-semibold"
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default PublicProfile