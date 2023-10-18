# Notes on how the backend API is used

## Requests

We are using `fetch` for sending requests.

### File upload

We are using `FormData` and `"content-type": "multipart/form-data"` for sending data and files in one request. See

-   https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch#uploading_a_file
