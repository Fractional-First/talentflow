import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useGetUser } from "@/queries/auth/useGetUser"

export const CURRENT_AGREEMENT_VERSION = "Master Candidate Agreement (13.02.2026) PDF"

interface AcceptanceData {
  signatureName: string
  contactEmail: string
  mobileCountryCode: string
  mobileNumber: string
  fullLegalName: string
  residentialAddress: {
    addressLine1: string
    addressLine2?: string
    city: string
    stateProvince: string
    postalCode: string
    country: string
  }
  contractingType: "individual" | "entity"
  entityName: string | null
  entityRegistrationNumber: string | null
  entityAddress: {
    addressLine1: string
    addressLine2?: string
    city: string
    stateProvince: string
    postalCode: string
    country: string
  } | null
  entityConfirmed: boolean | null
}

interface AgreementStatus {
  isAccepted: boolean
  isCurrentVersion: boolean
  acceptedAt: string | null
  agreementVersion: string | null
  acceptanceData: AcceptanceData | null
  isLoading: boolean
}

interface RecordAcceptanceParams {
  p_agreement_version: string
  p_signature_name: string
  p_contact_email: string
  p_mobile_country_code: string
  p_mobile_number: string
  p_full_legal_name: string
  p_residential_address: {
    addressLine1: string
    addressLine2?: string
    city: string
    stateProvince: string
    postalCode: string
    country: string
  }
  p_contracting_type: string
  p_entity_name?: string | null
  p_entity_registration_number?: string | null
  p_entity_address?: {
    addressLine1: string
    addressLine2?: string
    city: string
    stateProvince: string
    postalCode: string
    country: string
  } | null
  p_entity_confirmed?: boolean
}

export function useAgreementStatus(): AgreementStatus {
  const { data: user } = useGetUser()

  const { data, isLoading } = useQuery({
    queryKey: ["agreement-status", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("get_current_agreement_status", {
        p_current_version: CURRENT_AGREEMENT_VERSION,
      })

      if (error) throw error

      if (!data || data.length === 0) {
        return {
          isAccepted: false,
          isCurrentVersion: false,
          acceptedAt: null,
          agreementVersion: null,
          acceptanceData: null,
        }
      }

      const row = data[0]
      return {
        isAccepted: row.is_accepted ?? false,
        isCurrentVersion: row.is_current_version ?? false,
        acceptedAt: row.accepted_at ?? null,
        agreementVersion: row.agreement_version ?? null,
        acceptanceData: row.is_accepted
          ? {
              signatureName: row.signature_name,
              contactEmail: row.contact_email,
              mobileCountryCode: row.mobile_country_code,
              mobileNumber: row.mobile_number,
              fullLegalName: row.full_legal_name,
              residentialAddress: row.residential_address,
              contractingType: row.contracting_type as "individual" | "entity",
              entityName: row.entity_name,
              entityRegistrationNumber: row.entity_registration_number,
              entityAddress: row.entity_address,
              entityConfirmed: row.entity_confirmed,
            }
          : null,
      }
    },
    enabled: !!user?.id,
  })

  return {
    isAccepted: data?.isAccepted ?? false,
    isCurrentVersion: data?.isCurrentVersion ?? false,
    acceptedAt: data?.acceptedAt ?? null,
    agreementVersion: data?.agreementVersion ?? null,
    acceptanceData: data?.acceptanceData ?? null,
    isLoading,
  }
}

export function useRecordAcceptance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: RecordAcceptanceParams) => {
      const { data, error } = await supabase.functions.invoke(
        "record-agreement-acceptance",
        { body: params }
      )

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agreement-status"] })
    },
  })
}
