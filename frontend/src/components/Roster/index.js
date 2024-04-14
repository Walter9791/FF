import rosterStyles from './roster.module.css';

const Roster = ({roster}) => {
    return (
        <div className={rosterStyles.roster}>
      <h2>Roster</h2>
      <ul>
        {roster.map((player) => (
          <li key={player.id}>{player.name} - {player.position}</li>
        ))}
      </ul>
    </div>
    );
}

export default Roster;