import { Navigate, useLocation } from 'react-router-dom';

export const RedirectIfMatch = (): JSX.Element => {
  const location = useLocation();

  // If starts with church
  if (location.pathname.startsWith('/churches/search/')) {
    return <Navigate to='/churches/search' />;
  }
  if (location.pathname.startsWith('/churches/update/')) {
    return <Navigate to='/churches/search' />;
  }
  if (location.pathname.startsWith('/churches/inactivate/')) {
    return <Navigate to='/churches/search' />;
  }

  // If starts with ministry
  if (location.pathname.startsWith('/ministries/search/')) {
    return <Navigate to='/ministries/search' />;
  }
  if (location.pathname.startsWith('/ministries/update/')) {
    return <Navigate to='/ministries/search' />;
  }
  if (location.pathname.startsWith('/ministries/inactivate/')) {
    return <Navigate to='/ministries/search' />;
  }

  // If starts with pastor
  if (location.pathname.startsWith('/pastors/search/')) {
    return <Navigate to='/pastors/search' />;
  }
  if (location.pathname.startsWith('/pastors/update/')) {
    return <Navigate to='/pastors/search' />;
  }
  if (location.pathname.startsWith('/pastors/inactivate/')) {
    return <Navigate to='/pastors/search' />;
  }

  // If starts with copastor
  if (location.pathname.startsWith('/copastors/search/')) {
    return <Navigate to='/copastors/search' />;
  }
  if (location.pathname.startsWith('/copastors/update/')) {
    return <Navigate to='/copastors/search' />;
  }
  if (location.pathname.startsWith('/copastors/inactivate/')) {
    return <Navigate to='/copastors/search' />;
  }

  // If starts with supervisor
  if (location.pathname.startsWith('/supervisors/search/')) {
    return <Navigate to='/supervisors/search' />;
  }
  if (location.pathname.startsWith('/supervisors/update/')) {
    return <Navigate to='/supervisors/search' />;
  }
  if (location.pathname.startsWith('/supervisors/inactivate/')) {
    return <Navigate to='/supervisors/search' />;
  }

  // If starts with zone
  if (location.pathname.startsWith('/zones/search/')) {
    return <Navigate to='/zones/search' />;
  }
  if (location.pathname.startsWith('/zones/update/')) {
    return <Navigate to='/zones/search' />;
  }
  if (location.pathname.startsWith('/zones/inactivate/')) {
    return <Navigate to='/zones/search' />;
  }

  // If starts with preacher
  if (location.pathname.startsWith('/preachers/search/')) {
    return <Navigate to='/preachers/search' />;
  }
  if (location.pathname.startsWith('/preachers/update/')) {
    return <Navigate to='/preachers/search' />;
  }
  if (location.pathname.startsWith('/preachers/inactivate/')) {
    return <Navigate to='/preachers/search' />;
  }

  // If starts with family group
  if (location.pathname.startsWith('/family-groups/search/')) {
    return <Navigate to='/family-groups/search' />;
  }
  if (location.pathname.startsWith('/family-groups/update/')) {
    return <Navigate to='/family-groups/search' />;
  }
  if (location.pathname.startsWith('/family-groups/inactivate/')) {
    return <Navigate to='/family-groups/search' />;
  }

  // If starts with disciple
  if (location.pathname.startsWith('/disciples/search/')) {
    return <Navigate to='/disciples/search' />;
  }
  if (location.pathname.startsWith('/disciples/update/')) {
    return <Navigate to='/disciples/search' />;
  }
  if (location.pathname.startsWith('/disciples/inactivate/')) {
    return <Navigate to='/disciples/search' />;
  }

  // If starts with user
  if (location.pathname.startsWith('/users/search/')) {
    return <Navigate to='/users/search' />;
  }
  if (location.pathname.startsWith('/users/update/')) {
    return <Navigate to='/users/search' />;
  }
  if (location.pathname.startsWith('/users/inactivate/')) {
    return <Navigate to='/users/search' />;
  }


  // If starts with calendar events
  if (location.pathname.startsWith('/calendar-events/search/')) {
    return <Navigate to='/calendar-events/search' />;
  }
  if (location.pathname.startsWith('/calendar-events/update/')) {
    return <Navigate to='/calendar-events/search' />;
  }
  if (location.pathname.startsWith('/calendar-events/inactivate/')) {
    return <Navigate to='/calendar-events/search' />;
  }

  // If starts with offering income
  if (location.pathname.startsWith('/offerings/income/search/')) {
    return <Navigate to='/offerings/income/search' />;
  }
  if (location.pathname.startsWith('/offerings/income/update/')) {
    return <Navigate to='/offerings/income/search' />;
  }
  if (location.pathname.startsWith('/calendar-events/inactivate/')) {
    return <Navigate to='/calendar-events/search' />;
  }

  // If starts with offering expense
  if (location.pathname.startsWith('/offerings/expenses/search/')) {
    return <Navigate to='/offerings/expenses/search' />;
  }
  if (location.pathname.startsWith('/offerings/expense/update/')) {
    return <Navigate to='/offerings/expense/search' />;
  }
  if (location.pathname.startsWith('/offerings/expense/inactivate/')) {
    return <Navigate to='/offerings/expense/search' />;
  }

  // If it doesn't match the pattern, show the 404 component or redirect in another way
  return <Navigate to='/404' />;
};

export default RedirectIfMatch;
