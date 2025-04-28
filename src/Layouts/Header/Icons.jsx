import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";

const Icons = ({ showIcons = {} }) => {
  return (
    <Link to="/search">
      <div className="header-icons">{showIcons.search && <FiSearch />}</div>
    </Link>
  );
};

export default Icons;
