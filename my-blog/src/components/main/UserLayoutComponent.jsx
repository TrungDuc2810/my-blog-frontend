import PropTypes from 'prop-types';
import UserHeaderComponent from './UserHeaderComponent';
import UserFooterComponent from './UserFooterComponent';
import { useLocation } from 'react-router-dom';

function UserLayoutComponent({ children, onSearch, currentUser, setCurrentUser }) {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

  if (isAuthPage) {
    return children;
  }

  return (
    <>
      <UserHeaderComponent 
        onSearch={onSearch} 
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
      />
      <main>{children}</main>
      <UserFooterComponent />
    </>
  );
}

UserLayoutComponent.propTypes = {
  children: PropTypes.node.isRequired,
  onSearch: PropTypes.func.isRequired,
  currentUser: PropTypes.object,
  setCurrentUser: PropTypes.func.isRequired
};

export default UserLayoutComponent;