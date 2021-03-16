# api.md

## Endpoints

get /SDCForm :  Returns one or more SDCForms by ID. If a DiagnosticProcedureId is provided, this endpoint will will filter results on the given diagnostic.


post /SDCForm : Parses an XML string which represents an SDCForm and stores a JSON representation of the SDC Form.


put /SDCForm : Creates a new version of the SDCForm correspoding to the given SDCFormId. Will parse the XML form to obtain new JSON representation.


delete /SDCForm: Deletes SDCForms corresponding to the SDCFormIds provided from the server.



For a full description of the api please see the swagger UI, the swagger.yaml file is located in server/api/swager/
