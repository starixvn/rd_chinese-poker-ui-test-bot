export const fetchWrapper = {
  post,
};

function post(url: string, body: any): Promise<any> {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: body instanceof FormData ? body : JSON.stringify(body),
  };

  return fetch(url, requestOptions)
    .then(handleResponse)
    .catch((err) => {
      console.log(err);
    });
}

function handleResponse(response: Response): Promise<any> {
  return response.text().then((text) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      const error =
        (data && (data.detail || data.message)) || response.statusText;
      console.log(error);

      return Promise.reject(error);
    }

    return data;
  });
}
