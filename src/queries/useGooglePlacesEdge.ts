import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface PlacePrediction {
  description: string;
  place_id: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
  types: string[];
}

interface GooglePlacesResponse {
  predictions: PlacePrediction[];
  status: string;
}

interface PlaceDetails {
  place_id: string;
  name: string;
  formatted_address: string;
  address_components: Array<{
    long_name: string;
    short_name: string;
    types: string[];
  }>;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  types: string[];
}

interface PlaceDetailsResponse {
  result: PlaceDetails;
  status: string;
}

export const useGooglePlacesEdge = () => {
  const [placePredictions, setPlacePredictions] = useState<PlacePrediction[]>([]);
  const [isPlacePredictionsLoading, setIsPlacePredictionsLoading] = useState(false);

  const getPlacePredictions = useCallback(async (input: string, types?: string) => {
    if (!input.trim()) {
      setPlacePredictions([]);
      return;
    }

    setIsPlacePredictionsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('google-places', {
        body: { input, types: types || 'geocode' },
      });

      if (error) {
        console.error('Error calling google-places function:', error);
        setPlacePredictions([]);
        return;
      }

      const response = data as GooglePlacesResponse;
      
      if (response.status === 'OK') {
        setPlacePredictions(response.predictions || []);
      } else {
        console.warn('Google Places API returned status:', response.status);
        setPlacePredictions([]);
      }
    } catch (error) {
      console.error('Error fetching place predictions:', error);
      setPlacePredictions([]);
    } finally {
      setIsPlacePredictionsLoading(false);
    }
  }, []);

  const getPlaceDetails = useCallback(async (placeId: string, fields?: string): Promise<PlaceDetails | null> => {
    try {
      const { data, error } = await supabase.functions.invoke('google-place-details', {
        body: { placeId, fields },
      });

      if (error) {
        console.error('Error calling google-place-details function:', error);
        return null;
      }

      const response = data as PlaceDetailsResponse;
      
      if (response.status === 'OK') {
        return response.result;
      } else {
        console.warn('Google Place Details API returned status:', response.status);
        return null;
      }
    } catch (error) {
      console.error('Error fetching place details:', error);
      return null;
    }
  }, []);

  return {
    placePredictions,
    getPlacePredictions,
    getPlaceDetails,
    isPlacePredictionsLoading,
  };
};