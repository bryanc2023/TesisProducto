import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBuilding, faUser } from '@fortawesome/free-solid-svg-icons';
import "./css/RegisterPage.css"

function RegisterPage() {
  return  (
    <div className="container">
      <Link to="/registerE" className="square">
        <FontAwesomeIcon
          icon={faBuilding}
          className="icon"
        />
        <div className="link-container">
          <span className="link">Soy empresa</span>
        </div>
      </Link>
      <Link to="/register" className="square">
        <FontAwesomeIcon
          icon={faUser}
          className="icon"
        />
        <div className="link-container">
          <span className="link">Soy postulante</span>
        </div>
      </Link>
    </div>
  );
}

export default RegisterPage