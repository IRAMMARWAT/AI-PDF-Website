/**
 * DocuNova AI Resilient Client Fetcher
 * Safely parses responses and extracts structured error messages,
 * ensuring no raw HTML/doctype errors ever reach the user.
 */
export async function postJson<T = any>(endpoint: string, body: any): Promise<T> {
  let res: Response;
  try {
    res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  } catch (netErr: any) {
    throw new Error('Network connection error: ' + (netErr?.message || 'Failed to reach server.'));
  }

  const contentType = res.headers.get('content-type') || '';
  let data: any = null;

  if (contentType.includes('application/json')) {
    try {
      data = await res.json();
    } catch {
      data = null;
    }
  }

  if (!res.ok) {
    let errorMessage = 'Request failed';
    if (data && data.error) {
      if (typeof data.error === 'string') {
        // Try parsing nested JSON string if the backend forwarded a Gemini error string
        try {
          const parsed = JSON.parse(data.error);
          errorMessage = parsed?.error?.message || parsed?.message || data.error;
        } catch {
          errorMessage = data.error;
        }
      } else if (typeof data.error === 'object') {
        errorMessage = data.error.message || JSON.stringify(data.error);
      }
    } else {
      const rawText = await res.text().catch(() => '');
      if (rawText.toLowerCase().includes('doctype') || rawText.includes('<html')) {
        errorMessage = `The server returned an HTTP ${res.status} response. Please refresh or try again.`;
      } else {
        errorMessage = `Server error (${res.status}): ${rawText.slice(0, 100)}`;
      }
    }
    throw new Error(errorMessage);
  }

  if (!data) {
    throw new Error('Unexpected empty or non-JSON response from server.');
  }

  return data as T;
}
