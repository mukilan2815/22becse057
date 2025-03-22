export async function fetchData(url: string) {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Failed to fetch ${url}`);
      return await response.json();
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  }
  