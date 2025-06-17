
import { useState, useCallback } from 'react'

interface PlaceResult {
  place_id: string
  description: string
  structured_formatting: {
    main_text: string
    secondary_text: string
  }
}

interface PlaceDetails {
  place_id: string
  name: string
  formatted_address: string
  geometry: {
    location: {
      lat: number
      lng: number
    }
  }
  address_components: Array<{
    long_name: string
    short_name: string
    types: string[]
  }>
  types: string[]
}

export const useGooglePlaces = () => {
  const [predictions, setPredictions] = useState<PlaceResult[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchPlaces = useCallback(async (input: string) => {
    if (!input.trim() || input.length < 3) {
      setPredictions([])
      return
    }

    setIsLoading(true)
    try {
      // In a real implementation, this would call the Google Places API
      // For now, we'll simulate the API call
      const mockResults: PlaceResult[] = [
        {
          place_id: 'ChIJVTPokywQQUARehse5R9Q9N0',
          description: 'San Francisco, CA, USA',
          structured_formatting: {
            main_text: 'San Francisco',
            secondary_text: 'CA, USA'
          }
        },
        {
          place_id: 'ChIJOwg_06VPwokRYv534QaPC8g',
          description: 'New York, NY, USA',
          structured_formatting: {
            main_text: 'New York',
            secondary_text: 'NY, USA'
          }
        }
      ].filter(place => 
        place.description.toLowerCase().includes(input.toLowerCase())
      )

      setPredictions(mockResults)
    } catch (error) {
      console.error('Error searching places:', error)
      setPredictions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const getPlaceDetails = useCallback(async (placeId: string): Promise<PlaceDetails | null> => {
    try {
      // Mock place details - in real implementation, this would call Google Places Details API
      const mockDetails: PlaceDetails = {
        place_id: placeId,
        name: 'San Francisco',
        formatted_address: 'San Francisco, CA, USA',
        geometry: {
          location: {
            lat: 37.7749,
            lng: -122.4194
          }
        },
        address_components: [
          {
            long_name: 'San Francisco',
            short_name: 'SF',
            types: ['locality', 'political']
          },
          {
            long_name: 'California',
            short_name: 'CA',
            types: ['administrative_area_level_1', 'political']
          },
          {
            long_name: 'United States',
            short_name: 'US',
            types: ['country', 'political']
          }
        ],
        types: ['locality', 'political']
      }

      return mockDetails
    } catch (error) {
      console.error('Error getting place details:', error)
      return null
    }
  }, [])

  return {
    predictions,
    isLoading,
    searchPlaces,
    getPlaceDetails
  }
}
