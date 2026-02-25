import styled from "styled-components";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Main = styled.main`
  min-height: calc(100vh - var(--navbar-height) - 60px);
  padding: var(--spacing-2xl) var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
  overflow: visible;

  @media (max-width: 768px) {
    padding: var(--spacing-xl) var(--spacing-md);
  }
`;

const Layout = ({ children }) => (
  <>
    <Navbar />
    <Main>{children}</Main>
    <Footer />
  </>
);

export default Layout;