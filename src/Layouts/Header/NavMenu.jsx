import { NavLink } from "react-router-dom";
import { FiUsers, FiStar, FiCalendar } from "react-icons/fi";

const NavMenu = () => {
  return (
    <nav className="nav-menu">
      <NavLink
        to="/communities"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <FiUsers />
        <span>커뮤니티</span>
      </NavLink>
      <NavLink
        to="/mountain-reviews"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <FiStar />
        <span>등산 후기</span>
      </NavLink>
      <NavLink
        to="/restaurant-reviews"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <FiStar />
        <span>맛집 후기</span>
      </NavLink>
      <NavLink
        to="/clubs"
        className={({ isActive }) => (isActive ? "active" : "")}
      >
        <FiCalendar />
        <span>모임</span>
      </NavLink>
    </nav>
  );
};

export default NavMenu;
