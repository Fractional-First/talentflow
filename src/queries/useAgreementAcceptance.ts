import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { useGetUser } from "@/queries/auth/useGetUser"

export const CURRENT_AGREEMENT_VERSION = "2026-01-30-mca-v1"

interface AgreementStatus {
  isAccepted: boolean
  isCurrentVersion: boolean
  acceptedAt: string | null
  agreementVersion: string | null
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
  p_user_agent?: string | null
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
        }
      }

      const row = data[0]
      return {
        isAccepted: row.is_accepted ?? false,
        isCurrentVersion: row.is_current_version ?? false,
        acceptedAt: row.accepted_at ?? null,
        agreementVersion: row.agreement_version ?? null,
      }
    },
    enabled: !!user?.id,
  })

  return {
    isAccepted: data?.isAccepted ?? false,
    isCurrentVersion: data?.isCurrentVersion ?? false,
    acceptedAt: data?.acceptedAt ?? null,
    agreementVersion: data?.agreementVersion ?? null,
    isLoading,
  }
}

export function useRecordAcceptance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (params: RecordAcceptanceParams) => {
      const { data, error } = await supabase.rpc("record_agreement_acceptance", {
        ...params,
        p_residential_address: params.p_residential_address as unknown as never,
        p_entity_address: (params.p_entity_address ?? null) as unknown as never,
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["agreement-status"] })
    },
  })
}
