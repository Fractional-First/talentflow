import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const GOOGLE_PLACES_API_KEY = Deno.env.get('GOOGLE_PLACES_API_KEY');
    
    if (!GOOGLE_PLACES_API_KEY) {
      console.error('GOOGLE_PLACES_API_KEY not found in environment variables');
      throw new Error('Google Places API key not configured');
    }

    const { placeId, fields = 'place_id,name,formatted_address,address_components,geometry,types' } = await req.json();
    
    if (!placeId) {
      throw new Error('PlaceId parameter is required');
    }

    console.log('Making request to Google Place Details API with placeId:', placeId);

    // Make request to Google Place Details API
    const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=${encodeURIComponent(fields)}&key=${GOOGLE_PLACES_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error('Google Place Details API error:', response.status, response.statusText);
      throw new Error(`Google Place Details API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    console.log('Google Place Details API response status:', data.status);
    
    if (data.status !== 'OK') {
      console.error('Google Place Details API returned error:', data.status, data.error_message);
      throw new Error(`Google Place Details API error: ${data.status} - ${data.error_message || 'Unknown error'}`);
    }

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in google-place-details function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'An unknown error occurred',
        status: 'REQUEST_DENIED'
      }), 
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});