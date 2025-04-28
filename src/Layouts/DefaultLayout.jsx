import Header from "./Header/Header";
import ContentContainer from "./ContentContainer";
import "../styles/layouts/defaultLayout.css";

import Footer from "./Footer/Footer";

const DefaultLayout = ({ children, headerProps }) => (
  <>
    {/* <header className="header-container">
      <ContentContainer>
        <Header {...headerProps} />
      </ContentContainer>
    </header> */}

    <ContentContainer>
      <main className="main-content">{children}</main>
    </ContentContainer>
    <Footer />
  </>
);

export default DefaultLayout;
