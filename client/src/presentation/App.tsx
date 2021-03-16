import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AppShell } from './hocs/components';
import HomePageController from './pages/home/HomePageController';
import PatientsPageController from './pages/patients/PatientsPageController';
import FormsPageController from './pages/forms/FormsPageController';
import FormResponsesController from './pages/form-responses/FormResponsesController';
import FormResponseCreateEditController from './pages/form-responses/create-edit/FormResponseCreateEditController';
import AddEditPatientPageController from './pages/patients/add-edit-patient/AddEditPatientPageController';
import AddEditFormFillerPageController from './pages/formFiller/add-edit-form-filler/AddEditFormFillerPageController';
import FormFillersPageController from './pages/formFiller/FormFillersPageController';
import { presentationEnums } from './core/enums';

const { routeNames } = presentationEnums;

const App = () => {
  return (
    <Router>
      <AppShell>
        <Switch>
          <Route exact path={routeNames.home}>
            <HomePageController />
          </Route>
          <Route path={routeNames.forms.base}>
            <FormsPageController />
          </Route>
          <Route exact path={routeNames.formResponses.base}>
            <FormResponsesController />
          </Route>
          <Route exact path={routeNames.formResponses.createEdit}>
            <FormResponseCreateEditController />
          </Route>
          <Route exact path={routeNames.patients.base}>
            <PatientsPageController />
          </Route>
          <Route exact path={routeNames.patients.addEdit}>
            <AddEditPatientPageController />
          </Route>
          <Route exact path={routeNames.formFillers.base}>
            <FormFillersPageController />
          </Route>
          <Route exact path={routeNames.formFillers.addEdit}>
            <AddEditFormFillerPageController />
          </Route>
        </Switch>
      </AppShell>
    </Router>
  );
};

export default App;
