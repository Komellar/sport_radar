import { observer } from "mobx-react";
import { useEffect } from "react";

import { matchesStore } from "@store/MatchesStore";
import { socket } from "@common/socket";
import { Card } from "@components/Card";
import { PageContainer } from "@components/PageContainer";
import {
  MatchResponseMessages,
  Match,
  MatchStatus,
} from "@features/Matches/types";
import {
  CardHeader,
  GoalsCounter,
  MatchesButton,
  SingleMatch,
} from "@features/Matches/components";

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
    <PageContainer>
      <Card>
        <CardHeader>Qatar 2023</CardHeader>
        <MatchesButton />
        {matchesStore.matches.map((match) => (
          <SingleMatch match={match} key={match.id} />
        ))}
        <GoalsCounter>Total goals: {matchesStore.totalGoals}</GoalsCounter>
      </Card>
    </PageContainer>
  );
});
