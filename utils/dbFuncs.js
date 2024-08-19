export const postData = async (method, data, api) => {
    const options = {
      method: method,
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    };
  
    try {
      const response = await fetch(api, options);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  
  export const fetchData = async (api) => {
    try {
      const response = await fetch(api);
      const data = await response.json();
      return data;
    } catch (error) {
      console.log(error);
    }
  };
  