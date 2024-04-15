import Navbar from '../Navbar';
import Footer from '../Footer';
import LeagueNavbar from '../LeagueNavbar/Index';


const Layout = ({ children, showLeagueNavbar, teamId, customClass = '' }) => {
  console.log("Showing league navbar:", showLeagueNavbar);
  return (
    <div className="layout-wrapper">
      <Navbar />
      {showLeagueNavbar && <LeagueNavbar teamId={teamId} />}
      <main className={`app ${customClass}`}>          
        <div className='layout-container'>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}   

export default Layout;
