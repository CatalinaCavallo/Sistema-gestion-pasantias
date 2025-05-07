import { Link } from "react-router-dom";
import logo from '../assets/logo2.png';

export default function Landing() {
  return (
    <div className="landing">
      <img src={logo} alt="Logo" className="logo-landing" />
      <div className="landing-buttons">
        <Link to="/login" className="landing-btn">Iniciar sesión</Link>
        <Link to="/registro" className="landing-btn">Registrarse</Link>
      </div>
    </div>
  );
}
