# goodplants Admin

A configurable admin panel for performing CRUD operations on local JSON files.

- Bootstrapped with express-generator (express v4.16.1), and handlebars.js for server rendered views.
- Originally built for the goodplants website, however views can easily be updated to match your data models.

## Getting started

1. Clone the repo
2. `npm install`
3. Create a .env file in the root containing:

```bash
# the port where you want to start the express server
PORT=5000
# path relative to the root where you will be storing the JSON data
DATA_PATH=./data/plants.json
# external image url
IMAGE_BASE_URL=http://localhost:3000/
# used for adding debugging to the server during testing
DEBUG=goodplants-admin:*
```

4. `npm start`
