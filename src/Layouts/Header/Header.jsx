import Logo from "./Logo";
import Title from "./Title";
import NavMenu from "./NavMenu";
import Icons from "./Icons";
import { Link } from "react-router-dom";
import AuthButtons from "./AuthButtons";
import BackButton from "./BackButton";
import "../../styles/layouts/header.css";

const Header = ({ showLogo = false, showBack = false, showIcons = {} }) => {
  return (
    <header className="main-header">
      {" "}
      {/* 추가된 wrapper */}
      <div className="header-inner">
        <div className="header-left">
          {showLogo && (
            <Link to="/" className="logo-container">
              <img
                src="/images/logoImage_image.png"
                alt="Logo"
                className="logo-image"
              />
              <img
                src="/images/logoImage_text.png"
                alt="Logo"
                className="logo-image"
              />
            </Link>
          )}
          {showBack && <BackButton />}
        </div>
        <div className="header-center">
          <NavMenu />
        </div>
        <div className="header-right">
          <Icons showIcons={showIcons} />
          <AuthButtons />
        </div>
      </div>
    </header>
  );
};

// const Header = ({
//   showLogo = false,
//   showBack = false,
//   title,
//   showIcons = {},
// }) => {
//   return (
//     <div className="header-inner">
//       <div className="header-left">
//         {showLogo && <Logo />}
//         {showBack && <BackButton />}
//         <Title title={title} />
//       </div>
//       <div className="header-center">
//         <NavMenu />
//       </div>
//       <div className="header-right">
//         <Icons showIcons={showIcons} />
//         <AuthButtons />
//       </div>
//     </div>
//   );
// };

export default Header;
