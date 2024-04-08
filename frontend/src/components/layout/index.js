import Navbar from '../Navbar';
import Footer from '../Footer';
import LeagueNavbar from '../LeagueNavbar/Index';


const Layout = ({ children, showLeagueNavbar, teamId, customClass = '' }) => {
  console.log("Showing league navbar:", showLeagueNavbar);
  return (
    <div>
      <Navbar />
      {showLeagueNavbar && <LeagueNavbar teamId={teamId} />}
      {/* {showLeagueNavbar && <LeagueNavbar />} */}
        <main className= {'app ${customClass'}>
            <div className='league-navbar'>               
              <div className='layout-container'>
                {children}
              </div>              
            </div>
        </main>
      <Footer />
    </div>
  );
}   

export default Layout;