# Decisions related to the API exposed by the Express server

## Handling files

### File upload

For uploading files the `expressjs/multer` middleware is used. See:

-   https://github.com/expressjs/multer
-   https://medium.com/@ritikkhndelwal/getting-the-data-from-the-multipart-form-data-in-node-js-dc2d99d10f97
-   Example HTTP request with `multipart/form-data`: https://stackoverflow.com/questions/4238809/example-of-multipart-form-data

### Sending files in responses

To send a file to the client, the "native" Express.js-way does not work very well, since it expects the files to be persisted on disk. We, however, load the files from the database and into memory (in form of a JS `Buffer` object). To be able to send a file from memory, we use `stream.PassThrough` as described [in this StackOverflow post](https://stackoverflow.com/questions/45922074/node-express-js-download-file-from-memory-filename-must-be-a-string).

Helpful resource for working with streams in Node JS:

-   https://www.freecodecamp.org/news/node-js-streams-everything-you-need-to-know-c9141306be93/
