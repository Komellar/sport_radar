import { Match } from "../../types/match";
import { Row, ContentText } from "./SingleMatch.styled";

export const SingleMatch = ({ match }: { match: Match }) => {
  return (
    <Row>
      <ContentText>
        {match.teams.home} vs {match.teams.away}
      </ContentText>
      <ContentText>
        {match.score.home}:{match.score.away}
      </ContentText>
    </Row>
  );
};
