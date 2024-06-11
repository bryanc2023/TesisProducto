
import '../components/css/HomePage.css';
import '../components/css/Footer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserPlus, faUserTie, faBriefcase, faBuilding } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import Navbar from "../components/layout/Navbar";



const Home = () => {
    return(
      <div className="App">
      <Navbar />
      <header className="App-header">
        <div className="header-content">
          <h1>Bienvenido a ProaJob</h1>
          <p>La nueva app de Proasetel S.A para gestionar ofertas de trabajo de manera eficiente</p>
        </div>
      </header>
      <section className="offer-section">
        <div className="offer-content">
          <h2>Acerca de Proasetel S.A</h2>
          <p>
            Proasetel S.A es una empresa líder en soluciones tecnológicas que se enorgullece en presentar ProaJob, nuestra nueva app diseñada para 
            gestionar ofertas de trabajo de manera efectiva. Con ProaJob, puedes buscar, postularte y gestionar oportunidades laborales de manera 
            sencilla y organizada, todo en una sola plataforma.
          </p>
          <p>
            Nuestra misión es conectar a los mejores talentos con las empresas más destacadas, facilitando el proceso de contratación y asegurando 
            que tanto empleadores como candidatos tengan la mejor experiencia posible.
          </p>
        </div>
        <div className="offer-action">
          <div className="container-button-form">
            <p>¿Eres nuevo aquí? Regístrate para acceder a todas nuestras ofertas y comenzar a postularte hoy mismo.</p>
            <div className="button-group">
              <button className="button-form" onClick={() => window.location.href = '/registerE'}>
                <FontAwesomeIcon icon={faBuilding} /> Registrarse como Empresa
              </button>
              <button className="button-form" onClick={() => window.location.href = '/register'}>
                <FontAwesomeIcon icon={faUserPlus} /> Registrarse como Postulante
              </button>
            </div>
          </div>
        </div>
      </section>
      <section className="login-section">
        <div className="login-option postulante">
          <FontAwesomeIcon icon={faUserTie} size="3x" style={{ marginBottom: '10px' }} />
          <h3>Iniciar Sesión como Postulante</h3>
          <p>Accede a tu cuenta para postularte a las mejores ofertas laborales.</p>
          <div className="container-button-form">
            <button className="button-form" onClick={() => window.location.href = '/login'}>Iniciar Sesión</button>
          </div>
        </div>
        <div className="login-option empresa">
          <FontAwesomeIcon icon={faBriefcase} size="3x" style={{ marginBottom: '10px' }} />
          <h3>Iniciar Sesión como Empresa</h3>
          <p>Publica tus ofertas de trabajo y encuentra al candidato ideal.</p>
          <div className="container-button-form">
            <button className="button-form" onClick={() => window.location.href = '/login'}>Iniciar Sesión</button>
          </div>
        </div>
        <div className="login-option empresa">
          <FontAwesomeIcon icon={faUserTie} size="3x" style={{ marginBottom: '10px' }} />
          <h3>Iniciar Sesión como Postulante</h3>
          <p>Accede a tu cuenta personalizada como postulante.</p>
          <div className="container-button-form">
            <Link to="/LogPostu" className="button-form">Ir a Perfil Postulante</Link>
          </div>
        </div>
        <div className="login-option empresa">
          <FontAwesomeIcon icon={faBriefcase} size="3x" style={{ marginBottom: '10px' }} />
          <h3>Iniciar Sesión como Empresa</h3>
          <p>Accede a tu cuenta personalizada como empresa.</p>
          <div className="container-button-form">
            <Link to="/Logemp" className="button-form">Ir a Perfil Empresa</Link>
          </div>
        </div>
      </section>
      <footer className="footer">
        &copy; 2024 ProaJob. Todos los derechos reservados.
      </footer>
    </div>
  
    )
  }
  
  export default Home