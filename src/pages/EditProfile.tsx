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
import { PublicProfileLink } from "@/components/edit-profile/PublicProfileLink"
import { StickyActionBar } from "@/components/edit-profile/StickyActionBar"
import { InlineLinkedInField } from "@/components/edit-profile/InlineLinkedInField"
import ProfilePictureUpload from "@/components/ProfilePictureUpload"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { useEditProfile } from "@/hooks/useEditProfile"
import { useIsMobile } from "@/hooks/use-mobile"
import { Edit } from "lucide-react"
import { TooltipProvider } from "@/components/ui/tooltip"

const EditProfile = () => {
  const {
    user,
    profileData,
    profileVersion,
    formData,
    isLoading,
    error,
    isSubmitting,
    editStates,
    personasActiveTab,
    personaEditStates,
    saveStatus,
    mainContentRef,
    profileSlug,
    isPublished,
    linkedinUrl,
    publicProfileUrl,
    updatePublishStatus,
    isUpdatingPublishStatus,
    handlePublishToggle,
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

  const isMobile = useIsMobile()

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <Spinner size="lg" />
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
    <TooltipProvider>
      <DashboardLayout>
        {/* Preview Mode Banner on Edit Screen */}
        {user?.id && (
          <div className="bg-gradient-to-r from-teal-600 to-teal-500 border-b border-teal-400">
            <div className="px-4 py-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-white">
                  <h3 className="font-semibold text-lg">
                    Your profile is still in preview mode. See how it will
                    appear on your public page before going live.
                  </h3>
                </div>
                <Button
                  asChild
                  className="bg-white text-teal-600 hover:bg-teal-50 font-medium whitespace-nowrap"
                >
                  <a
                    href={`/profile/preview/${user.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Open Preview
                  </a>
                </Button>
              </div>
            </div>
          </div>
        )}
        <div ref={mainContentRef} className="max-w-6xl mx-auto space-y-6 p-6">
          {/* Header with explanatory text */}
          <div className="space-y-2">
            <p className="text-sm text-gray-600 text-center">
              This summary is curated based on your experience and skills. Feel
              free to refine it to better reflect your voice by clicking on the
              edit icon <Edit className="h-4 w-4 inline-block ml-1" />.
            </p>

            {/* Auto-save Status positioned below */}
            <div className="flex justify-end">
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

                  {/* LinkedIn Profile Field */}
                  <InlineLinkedInField
                    value={linkedinUrl || ""}
                    onChange={(value) =>
                      handleInputChange("linkedinUrl", value)
                    }
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
                headerClassName="bg-[#449889] text-white"
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

              {/* Education - Desktop only (0.3+) */}
              {(!profileVersion || profileVersion >= "0.3") && (
                <div className="hidden lg:block">
                  <EditableArraySection
                    content="List your educational background and academic achievements"
                    title="Education"
                    items={formData.education || []}
                    isEditing={editStates.education}
                    onEditToggle={() => toggleEdit("education")}
                    onChange={(newArr) =>
                      handleInputChange("education", newArr)
                    }
                    placeholder="Education"
                    addLabel="Add Education"
                    displayType="bullets"
                  />
                </div>
              )}

              {/* Focus Areas - Desktop only */}
              {!isMobile && (
                <EditableArraySection
                  content="Add the areas where you focus your professional expertise"
                  title="Focus Areas"
                  items={formData.focus_areas || []}
                  isEditing={editStates.focusAreas}
                  onEditToggle={() => toggleEdit("focusAreas")}
                  onChange={(newArr) =>
                    handleInputChange("focus_areas", newArr)
                  }
                  placeholder="Focus area"
                  addLabel="Add Area"
                />
              )}

              {/* Industries - Desktop only */}
              {!isMobile && (
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
              )}

              {/* Geographical Coverage - Desktop only */}
              {!isMobile && (
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
              )}

              {/* Stage - Desktop only */}
              {!isMobile && (
                <EditableArraySection
                  content="Add the company stages you prefer to work with (startup, growth, enterprise, etc.)"
                  title="Stage"
                  items={formData.stage_focus || []}
                  isEditing={editStates.stages}
                  onEditToggle={() => toggleEdit("stages")}
                  onChange={(newArr) =>
                    handleInputChange("stage_focus", newArr)
                  }
                  placeholder="Stage"
                  addLabel="Add Stage"
                />
              )}

              {/* Personal Interests - Desktop only */}
              {!isMobile && (
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
              )}

              {/* Certifications - Desktop only */}
              {formData.certifications &&
                formData.certifications.length > 0 && (
                  <div className="hidden lg:block">
                    <EditableArraySection
                      content="List your relevant certifications and professional credentials"
                      title="Certifications"
                      items={formData.certifications || []}
                      isEditing={editStates.certifications}
                      onEditToggle={() => toggleEdit("certifications")}
                      onChange={(newArr) =>
                        handleInputChange("certifications", newArr)
                      }
                      placeholder="Certification"
                      addLabel="Add Certification"
                    />
                  </div>
                )}
            </div>

            {/* Right Column - Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Meet Section */}
              <EditableTextSection
                content="Write an engaging introduction that tells your professional story and what makes you unique"
                title={`Meet ${
                  formData?.name?.split(" ")[0] || "Professional"
                }`}
                value={formData?.meet_them || ""}
                onChange={(value) => handleInputChange("meet_them", value)}
                isEditing={editStates.meetIntro}
                onEditToggle={() => toggleEdit("meetIntro")}
                placeholder="Introduction not available"
                bgColorClass="bg-[#449889]"
                textColorClass="text-white"
                headerClassName="bg-[#449889] text-white"
                labelClassName="text-lg font-semibold"
                textAreaClass="text-white bg-[#449889]"
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
                headerClassName="bg-[#449889] text-white"
                labelClassName="text-lg font-semibold"
              />

              {/* Functional Skills */}
              <FunctionalSkillsSection
                content="Organize your skills by category and provide details about your expertise level"
                functionalSkills={formData.functional_skills || {}}
                profileVersion={profileVersion}
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
                headerClassName="bg-[#449889] text-white"
                labelClassName="text-lg font-semibold"
              />

              {/* Mobile/Tablet sections moved below User Manual */}
              <div className="lg:hidden space-y-6">
                {/* Education - Mobile/Tablet only (0.3+) */}
                {(!profileVersion || profileVersion >= "0.3") && (
                  <EditableArraySection
                    content="List your educational background and academic achievements"
                    title="Education"
                    items={formData.education || []}
                    isEditing={editStates.education}
                    onEditToggle={() => toggleEdit("education")}
                    onChange={(newArr) =>
                      handleInputChange("education", newArr)
                    }
                    placeholder="Education"
                    addLabel="Add Education"
                    displayType="bullets"
                  />
                )}

                {/* Focus Areas - Mobile/Tablet only */}
                <EditableArraySection
                  content="Add the areas where you focus your professional expertise"
                  title="Focus Areas"
                  items={formData.focus_areas || []}
                  isEditing={editStates.focusAreas}
                  onEditToggle={() => toggleEdit("focusAreas")}
                  onChange={(newArr) =>
                    handleInputChange("focus_areas", newArr)
                  }
                  placeholder="Focus area"
                  addLabel="Add Area"
                />

                {/* Industries - Mobile/Tablet only */}
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

                {/* Geographical Coverage - Mobile/Tablet only */}
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

                {/* Stage - Mobile/Tablet only */}
                <EditableArraySection
                  content="Add the company stages you prefer to work with (startup, growth, enterprise, etc.)"
                  title="Stage"
                  items={formData.stage_focus || []}
                  isEditing={editStates.stages}
                  onEditToggle={() => toggleEdit("stages")}
                  onChange={(newArr) =>
                    handleInputChange("stage_focus", newArr)
                  }
                  placeholder="Stage"
                  addLabel="Add Stage"
                />

                {/* Personal Interests - Mobile/Tablet only */}
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

                {/* Certifications - Mobile/Tablet only */}
                {formData.certifications &&
                  formData.certifications.length > 0 && (
                    <EditableArraySection
                      content="List your relevant certifications and professional credentials"
                      title="Certifications"
                      items={formData.certifications || []}
                      isEditing={editStates.certifications}
                      onEditToggle={() => toggleEdit("certifications")}
                      onChange={(newArr) =>
                        handleInputChange("certifications", newArr)
                      }
                      placeholder="Certification"
                      addLabel="Add Certification"
                    />
                  )}
              </div>
            </div>
          </div>

          {/* Public Profile Link */}
          {isPublished && publicProfileUrl && (
            <PublicProfileLink publicProfileUrl={publicProfileUrl} />
          )}

          {/* Bottom padding to account for sticky action bar */}
          <div className="h-32 sm:h-24" />
        </div>

        {/* Sticky Action Bar */}
        <StickyActionBar
          isPublished={isPublished}
          isUpdatingPublishStatus={isUpdatingPublishStatus}
          isSubmitting={isSubmitting}
          onRegenerateProfile={() => navigate("/create-profile")}
          onPublishToggle={handlePublishToggle}
          onSaveAndContinue={handleContinue}
        />
      </DashboardLayout>
    </TooltipProvider>
  )
}
export default EditProfile
