
import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useAuth } from "../context/AuthContext";


function Navbar() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="navbar sticky top-0 z-100 bg-transparent shadow-md px-4 backdrop-blur-xs">
      <div className="flex-1">
        <Link to="/" className="btn btn-ghost normal-case text-xl">Eduverse</Link>
      </div>
      <div className="flex-none flex items-center gap-2">
        {/* <Link to="/dashboard" className="btn btn-secondary">Dashboard</Link> */}
        {true && (
          <button
            className="btn btn-ghost btn-circle"
            title="Logout"
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" />
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
