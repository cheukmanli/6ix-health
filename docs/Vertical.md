## Server

- Defined endpoint request and response structure for:
  - Creating an SDCForm
  - Getting SDCForms
  - Updating an SDCForm
  - Deleting an SDCForm
- Implemented logic for being able to getting and creating SDCForms (XML parsing is being mocked for now)

## Client

- Created UI and business logic (including data fetching) for creating and getting SDCForms
- Able to click a FAB which allows one to select an XML file representing an SDCForm to be uploaded, which will then be sent to server to procees and return the JSON representation of it
- Able to view all the forms uploaded thus far in the forms route populated inside a listview
