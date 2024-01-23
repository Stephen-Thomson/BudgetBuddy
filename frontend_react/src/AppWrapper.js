import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import LoginPage from './LoginPage';
import SelectFunction from './SelectFunction';
import GeneralJournal from './GeneralJournal';
import CreateIncome from './CreateIncome';
import CreateAsset from './CreateAsset';
import CreateExpense from './CreateExpense';
import CreateAccountPayable from './CreateAccountPayable';
import Help from './Help';
import Totals from './Totals';
import CurrentBudget from './CurrentBudget';
import AdjustableBudget from './AdjustableBudget';
import ToDo from './ToDo';
import EditAccount from './EditAccount';
import GeneralJournalView from './GeneralJournalView';
import PostSuccess from './PostSuccess';

// Wrapper for the pages to handle routing
const AppWrapper = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/selectFunction" element={<SelectFunction />} />
        <Route path="/generalJournal" element={<GeneralJournal />} /> {/* Add routes for other pages */}
        <Route path="/createIncome" element={<CreateIncome />} />
        <Route path="/createAsset" element={<CreateAsset />} />
        <Route path="/createExpense" element={<CreateExpense />} />
        <Route path="/createAccountPayable" element={<CreateAccountPayable />} />
        <Route path="/help" element={<Help />} />
        <Route path="/totals" element={<Totals />} />
        <Route path="/currentBudget" element={<CurrentBudget />} />
        <Route path="/adjustableBudget" element={<AdjustableBudget />} />
        <Route path="/toDo" element={<ToDo />} />
        <Route path="/editAccount/:accountName" element={<EditAccount />} />
        <Route path="/generalJournalView" element={<GeneralJournalView />} />
        <Route path="/postSuccess" element={<PostSuccess />} />
      </Routes>
    </Router>
  );
};

export default AppWrapper;