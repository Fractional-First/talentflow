import { useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { BasicInfoSection } from "@/components/edit-profile/BasicInfoSection"
import { EditableArraySection } from "@/components/edit-profile/EditableArraySection"
import { EditableTextSection } from "@/components/edit-profile/EditableTextSection"
import { FunctionalSkillsSection } from "@/components/edit-profile/FunctionalSkillsSection"
import { PersonasSection } from "@/components/edit-profile/PersonasSection"
import { SuperpowersSection } from "@/components/edit-profile/SuperpowersSection"
import ProfilePictureUpload from "@/components/ProfilePictureUpload"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { profileStorage, GeneratedProfile } from "@/utils/profileStorage"

const ProfileGeneratorPreview = () => {
  const navigate = useNavigate()
  const [profile, setProfile] = useState<GeneratedProfile | null>(null)
  const [personasActiveTab, setPersonasActiveTab] = useState("0")

  useEffect(() => {
    // Get profile from sessionStorage
    const storedProfile = profileStorage.get()
    if (storedProfile) {
      setProfile(storedProfile)
    } else {
      // No profile found, redirect to create
      navigate("/profile-generator/create", { replace: true })
    }
  }, [navigate])

  const handleSignUp = () => {
    // Navigate to signup with profile data
    navigate("/signup")
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your profile...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header matching site style */}
      <header className="border-b border-border/40 bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src="/lovable-uploads/daefe55a-8953-4582-8fc8-12a66755ac2a.png"
                alt="Fractional First"
                className="h-12 w-auto cursor-pointer"
                onClick={() => navigate("/profile-generator")}
              />
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/profile-generator/create")}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Generator
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Claim banner for generated profiles */}
      <div className="bg-gradient-to-r from-teal-600 to-teal-500 border-b border-teal-400">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-white">
              <h3 className="font-semibold text-lg">
                🎉 Your profile has been generated! Claim it now to make it
                yours.
              </h3>
              <p className="text-sm opacity-90 mt-1">
                Sign up to edit, customize, and publish your professional
                profile.
              </p>
            </div>
            <Button
              onClick={handleSignUp}
              className="bg-white text-teal-600 hover:bg-teal-50 font-medium whitespace-nowrap"
            >
              Claim Your Profile
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto space-y-6 p-6">
        {/* Main Layout - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image and Basic Info */}
            <div className="text-center">
              <div className="relative mb-4 inline-block">
                <ProfilePictureUpload
                  currentImage={profile?.profilePicture}
                  userName={profile?.name || "User"}
                  onImageUpdate={() => {}} // No-op for read-only
                  readOnly={true}
                />
              </div>

              <div className="space-y-2">
                <BasicInfoSection
                  content=""
                  name={profile?.name || ""}
                  role={profile?.role || ""}
                  location={profile?.location || ""}
                  isEditing={false}
                  onEditToggle={() => {}} // No-op for read-only
                  onChange={() => {}} // No-op for read-only
                  readOnly={true}
                />

                {/* LinkedIn Link */}
                {profile?.linkedinurl && (
                  <div className="flex justify-center mt-4">
                    <a
                      href={profile.linkedinurl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-opacity hover:opacity-80"
                      aria-label="View LinkedIn Profile"
                    >
                      <img
                        src="/lovable-uploads/2c01f7e9-f692-45b8-8183-ab3763bd33d1.png"
                        alt="LinkedIn"
                        className="h-6 w-6"
                      />
                    </a>
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <EditableTextSection
              content=""
              title="Description"
              value={profile?.summary || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="Description not available"
              className="bg-white"
              headerClassName="bg-[#449889] text-white"
              labelClassName="text-base font-semibold"
              readOnly={true}
            />

            {/* Key Roles */}
            <EditableArraySection
              content=""
              title="Key Roles"
              items={profile.highlights || []}
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
              items={profile.focus_areas || []}
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
              items={profile.industries || []}
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
              items={profile.geographical_coverage || []}
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
              items={profile.stage_focus || []}
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
              items={profile.personal_interests || []}
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
              items={profile.certifications || []}
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
              title={`Meet ${profile?.name?.split(" ")[0] || "Professional"}`}
              value={profile?.meet_them || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="Introduction not available"
              bgColorClass="bg-[#449889]"
              textColorClass="text-white"
              headerClassName="bg-[#449889] text-white"
              labelClassName="text-lg font-semibold"
              textAreaClass="text-white bg-[#449889]"
              readOnly={true}
            />

            {/* Personas Section */}
            <PersonasSection
              content=""
              personas={profile.personas || []}
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
              superpowers={profile.superpowers || []}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onSuperpowersChange={() => {}} // No-op for read-only
              readOnly={true}
            />

            {/* Sweet Spot Section */}
            <EditableTextSection
              content=""
              title="Sweet Spot"
              value={profile?.sweetspot || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="Sweet spot not available"
              className="bg-white"
              headerClassName="bg-[#449889] text-white"
              labelClassName="text-lg font-semibold"
              readOnly={true}
            />

            {/* Functional Skills */}
            <FunctionalSkillsSection
              content=""
              functionalSkills={profile.functional_skills || {}}
              profileVersion={"0.2"}
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              onFunctionalSkillsChange={() => {}} // No-op for read-only
              readOnly={true}
            />

            {/* User Manual */}
            <EditableTextSection
              content=""
              title={`${
                profile?.name?.split(" ")[0] || "Professional"
              }'s User Manual`}
              value={profile?.user_manual || ""}
              onChange={() => {}} // No-op for read-only
              isEditing={false}
              onEditToggle={() => {}} // No-op for read-only
              placeholder="User manual not available"
              className="bg-white"
              headerClassName="bg-[#449889] text-white"
              labelClassName="text-lg font-semibold"
              readOnly={true}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfileGeneratorPreview
