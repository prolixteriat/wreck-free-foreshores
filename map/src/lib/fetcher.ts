import { ZodSchema } from 'zod';

// -----------------------------------------------------------------------------

export async function fetcher<T>(url: string, schema: ZodSchema<T>): Promise<T> {

    const response = await fetch(url);
  
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
    }
  
    const json = await response.json();
  
    const parsed = schema.safeParse(json);
  
    if (parsed.success) {
        return parsed.data;
    }
  
    console.error('Zod validation error:', parsed.error.errors);
    throw new Error('Invalid data returned from API');
}
// -----------------------------------------------------------------------------
// Variant with JWT authorisation.

export async function fetcherAuth<T>(data: string[], schema: ZodSchema<T>): Promise<T> {

    if (data.length !== 2) {
        throw new Error('fetcherAuth: Invalid query data provided');
    }

    const url = data[0];
    const token = data[1];
    const response = await fetch(url, {
        method: 'GET',  
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        }
    });
  
    if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status}`);
    }
  
    const json = await response.json();
  
    const parsed = schema.safeParse(json);
  
    if (parsed.success) {
        return parsed.data;
    }
  
    console.error('Zod validation error:', parsed.error.errors);
    throw new Error('Invalid data returned from API');
}
// -----------------------------------------------------------------------------
// End
// -----------------------------------------------------------------------------
