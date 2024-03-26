import Navbar from '../Navbar';
import Footer from '../Footer';

const Layout = ({ children }) => {
  return (
    <div>
      <Navbar />
        <main className='app'>
            <div className='layout-container'>
              {children}
            </div>
        </main>
      <Footer />
    </div>
  );
}   

export default Layout;