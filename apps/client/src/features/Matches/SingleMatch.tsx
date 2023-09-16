import { Match } from "./types";

export const SingleMatch = ({ match }: { match: Match }) => {
  return (
    <div>
      <h3>
        {match.teams.home} - {match.teams.away}
      </h3>
      <p>
        {match.score.home}-{match.score.away}
      </p>
    </div>
  );
};
