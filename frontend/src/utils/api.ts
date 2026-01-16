const BASE_URL = "http://127.0.0.1:8000/api/v1/";

export const getApi: <Res>(endpoint: string,type:string) => Promise<Res> = async (
  endpoint,type:string = ""
) => {
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  const url = type === "new" ? endpoint : `${BASE_URL}${endpoint}`
  let response = await fetch(url, config);

  return await response.json();
};