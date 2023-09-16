import { observer } from "mobx-react";
import { useEffect } from "react";

import { matchesStore } from "@store/MatchesStore";
import { SingleMatch } from "@features/Matches/components/SingleMatch";
import { MatchesButton } from "@features/Matches/components/MatchesButton/MatchesButton";
import { socket } from "@common/socket";
import {
  MatchResponseMessages,
  Match,
  MatchStatus,
} from "@features/Matches/types";

export const Matches = observer(() => {
  useEffect(() => {
    socket.on(MatchResponseMessages.Matches, (data: Match[]) => {
      matchesStore.setMatches(data);
    });

    socket.on(MatchResponseMessages.EndTime, () => {
      matchesStore.setMatchStatus(MatchStatus.Finished);
    });

    return () => {
      socket.off(MatchResponseMessages.Matches);
      socket.off(MatchResponseMessages.EndTime);
    };
  });

  return (
    <div>
      <h5>{matchesStore.matchTime}</h5>
      {matchesStore.matches.map((match) => {
        return <SingleMatch match={match} key={match.id} />;
      })}
      <MatchesButton />
    </div>
  );
});
