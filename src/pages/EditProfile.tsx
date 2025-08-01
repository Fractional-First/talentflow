
import { initialSteps } from "@/components/dashboard/OnboardingSteps"
import { DashboardLayout } from "@/components/DashboardLayout"
import { AutoSaveStatus } from "@/components/edit-profile/AutoSaveStatus"
import { BasicInfoSection } from "@/components/edit-profile/BasicInfoSection"
import { EditableArraySection } from "@/components/edit-profile/EditableArraySection"
import { EditableTextSection } from "@/components/edit-profile/EditableTextSection"
import EmptyProfile from "@/components/edit-profile/EmptyProfile"
import { FunctionalSkillsSection } from "@/components/edit-profile/FunctionalSkillsSection"
import LoadingError from "@/components/edit-profile/LoadingError"
import { PersonasSection } from "@/components/edit-profile/PersonasSection"
import { SuperpowersSection } from "@/components/edit-profile/SuperpowersSection"
import ProfilePictureUpload from "@/components/ProfilePictureUpload"
import { Button } from "@/components/ui/button"
import { useEditProfile } from "@/hooks/useEditProfile"
import { ArrowLeft, ArrowRight, Edit } from "lucide-react"

const EditProfile = () => {
  const {
    user,
    profileData,
    formData,
    isLoading,
    error,
    isSubmitting,
    editStates,
    personasActiveTab,
    personaEditStates,
    saveStatus,
    mainContentRef,
    setPersonasActiveTab,
    toggleEdit,
    handleContinue,
    handleInputChange,
    handleProfilePictureUpdate,
    retrySave,
    handlePersonaLocalUpdate,
    handleAddPersona,
    handleRemovePersona,
    navigate,
  } = useEditProfile()

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="max-w-6xl mx-auto space-y-6 p-6">
          <div className="text-center">Loading profile...</div>
        </div>
      </DashboardLayout>
    )
  }
  if (error) {
    console.error("Profile query error:", error)
    return <LoadingError initialSteps={initialSteps} error={error} />
  }

  // Check if we have meaningful profile data
  if (!profileData || !formData.name) {
    return <EmptyProfile initialSteps={initialSteps} />
  }

  return (
    <DashboardLayout>
      <div ref={mainContentRef} className="max-w-6xl mx-auto space-y-6 p-6">
        {/* Header with Auto-save Status */}
        <div className="relative">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">
              This summary is curated based on your experience and skills. Feel
              free to refine it to better reflect your voice by clicking on the
              edit icon <Edit className="h-4 w-4 inline-block ml-1" />.
            </p>
          </div>

          {/* Auto-save Status - Fixed position in top right */}
          <div className="absolute top-0 right-0">
            <AutoSaveStatus
              status={saveStatus.status}
              lastSavedTime={saveStatus.lastSavedTime}
              onRetry={retrySave}
            />
          </div>
        </div>

        {/* Main Layout - Two Column */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Image and Basic Info */}
            <div className="text-center">
              <div className="relative mb-4 inline-block">
                <ProfilePictureUpload
                  currentImage={formData?.profilePicture}
                  userName={formData?.name || "User"}
                  onImageUpdate={handleProfilePictureUpdate}
                />
              </div>

              <div className="space-y-2">
                <BasicInfoSection
                  content="Update your name, role, and location to keep your profile current"
                  name={formData?.name || ""}
                  role={formData?.role || ""}
                  location={formData?.location || ""}
                  isEditing={editStates.basicInfo}
                  onEditToggle={() => toggleEdit("basicInfo")}
                  onChange={(field, value) => handleInputChange(field, value)}
                />
              </div>
            </div>

            {/* Description */}
            <EditableTextSection
              content="Write a compelling summary that captures your professional essence and value proposition"
              title="Description"
              value={formData?.summary || ""}
              onChange={(value) => handleInputChange("summary", value)}
              isEditing={editStates.description}
              onEditToggle={() => toggleEdit("description")}
              placeholder="Description not available"
              className="bg-white"
              headerClassName=""
              labelClassName="text-base font-semibold"
            />

            {/* Key Roles */}
            <EditableArraySection
              content="List your key professional roles and areas of expertise"
              title="Key Roles"
              items={formData.highlights || []}
              isEditing={editStates.keyRoles}
              onEditToggle={() => toggleEdit("keyRoles")}
              onChange={(newArr) => handleInputChange("highlights", newArr)}
              placeholder="Key role"
              addLabel="Add Role"
              displayType="bullets"
            />

            {/* Focus Areas */}
            <EditableArraySection
              content="Add the areas where you focus your professional expertise"
              title="Focus Areas"
              items={formData.focus_areas || []}
              isEditing={editStates.focusAreas}
              onEditToggle={() => toggleEdit("focusAreas")}
              onChange={(newArr) => handleInputChange("focus_areas", newArr)}
              placeholder="Focus area"
              addLabel="Add Area"
            />

            {/* Industries */}
            <EditableArraySection
              content="List the industries where you have experience or interest"
              title="Industries"
              items={formData.industries || []}
              isEditing={editStates.industries}
              onEditToggle={() => toggleEdit("industries")}
              onChange={(newArr) => handleInputChange("industries", newArr)}
              placeholder="Industry"
              addLabel="Add Industry"
            />

            {/* Geographical Coverage */}
            <EditableArraySection
              content="Specify the regions or locations where you can work or have experience"
              title="Geographical Coverage"
              items={formData.geographical_coverage || []}
              isEditing={editStates.geographicalCoverage}
              onEditToggle={() => toggleEdit("geographicalCoverage")}
              onChange={(newArr) =>
                handleInputChange("geographical_coverage", newArr)
              }
              placeholder="Region"
              addLabel="Add Region"
            />

            {/* Stage */}
            <EditableArraySection
              content="Add the company stages you prefer to work with (startup, growth, enterprise, etc.)"
              title="Stage"
              items={formData.stage_focus || []}
              isEditing={editStates.stages}
              onEditToggle={() => toggleEdit("stages")}
              onChange={(newArr) => handleInputChange("stage_focus", newArr)}
              placeholder="Stage"
              addLabel="Add Stage"
            />

            {/* Personal Interests */}
            <EditableArraySection
              content="Share your personal interests to help others connect with you on a human level"
              title="Personal Interests"
              items={formData.personal_interests || []}
              isEditing={editStates.personalInterests}
              onEditToggle={() => toggleEdit("personalInterests")}
              onChange={(newArr) =>
                handleInputChange("personal_interests", newArr)
              }
              placeholder="Interest"
              addLabel="Add Interest"
            />

            {/* Certifications */}
            <EditableArraySection
              content="List your relevant certifications and professional credentials"
              title="Certifications"
              items={formData.certifications || []}
              isEditing={editStates.certifications}
              onEditToggle={() => toggleEdit("certifications")}
              onChange={(newArr) => handleInputChange("certifications", newArr)}
              placeholder="Certification"
              addLabel="Add Certification"
            />
          </div>

          {/* Right Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Meet Section */}
            <EditableTextSection
              content="Write an engaging introduction that tells your professional story and what makes you unique"
              title={`Meet ${formData?.name?.split(" ")[0] || "Professional"}`}
              value={formData?.meet_them || ""}
              onChange={(value) => handleInputChange("meet_them", value)}
              isEditing={editStates.meetIntro}
              onEditToggle={() => toggleEdit("meetIntro")}
              placeholder="Introduction not available"
              bgColorClass="bg-teal-600"
              textColorClass="text-white"
              headerClassName="bg-teal-600 text-white"
              labelClassName="text-lg font-semibold"
            />

            {/* Personas Section */}
            <PersonasSection
              content="Define different professional personas that showcase various aspects of your expertise"
              personas={formData.personas || []}
              personaEditStates={personaEditStates}
              isEditing={editStates.personas}
              onEditToggle={() => toggleEdit("personas")}
              onPersonaLocalUpdate={handlePersonaLocalUpdate}
              onAddPersona={handleAddPersona}
              onRemovePersona={handleRemovePersona}
              activeTab={personasActiveTab}
              onActiveTabChange={setPersonasActiveTab}
            />

            {/* Superpowers Section */}
            <SuperpowersSection
              content="Highlight your unique strengths and what sets you apart professionally"
              superpowers={formData.superpowers || []}
              isEditing={editStates.superpowers}
              onEditToggle={() => toggleEdit("superpowers")}
              onSuperpowersChange={(newArr) =>
                handleInputChange("superpowers", newArr)
              }
            />

            {/* Sweet Spot Section */}
            <EditableTextSection
              content="Describe your ideal work scenarios and the type of challenges you excel at"
              title="Sweet Spot"
              value={formData?.sweetspot || ""}
              onChange={(value) => handleInputChange("sweetspot", value)}
              isEditing={editStates.sweetSpot}
              onEditToggle={() => toggleEdit("sweetSpot")}
              placeholder="Sweet spot not available"
              className="bg-white"
              headerClassName="bg-teal-600 text-white"
              labelClassName="text-lg font-semibold"
            />

            {/* Functional Skills */}
            <FunctionalSkillsSection
              content="Organize your skills by category and provide details about your expertise level"
              functionalSkills={formData.functional_skills || {}}
              isEditing={editStates.functionalSkills}
              onEditToggle={() => toggleEdit("functionalSkills")}
              onFunctionalSkillsChange={(skills) =>
                handleInputChange("functional_skills", skills)
              }
            />

            {/* User Manual */}
            <EditableTextSection
              content={`Share insights about your working style, communication preferences, and how others can best collaborate with you`}
              title={`${
                formData?.name?.split(" ")[0] || "Professional"
              }'s User Manual`}
              value={formData?.user_manual || ""}
              onChange={(value) => handleInputChange("user_manual", value)}
              isEditing={editStates.userManual}
              onEditToggle={() => toggleEdit("userManual")}
              placeholder="User manual not available"
              className="bg-white"
              headerClassName="bg-teal-600 text-white"
              labelClassName="text-lg font-semibold"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between items-center pt-6">
          <Button variant="outline" onClick={() => navigate("/create-profile")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Profile
          </Button>

          <Button
            onClick={handleContinue}
            disabled={isSubmitting}
            style={{ backgroundColor: '#449889' }}
            className="hover:opacity-90 text-white"
          >
            {isSubmitting ? "Processing..." : "Complete & Go to Dashboard"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </DashboardLayout>
  )
}
export default EditProfile
