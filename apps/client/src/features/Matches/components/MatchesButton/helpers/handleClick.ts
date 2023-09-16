import { socket } from "@common/socket";
import { MatchRequestMessages, MatchStatus } from "@features/Matches/types";
import { matchesStore } from "@store/MatchesStore";

const handleStart = () => {
  socket.emit(MatchRequestMessages.Start);
  matchesStore.setMatchStatus(MatchStatus.Running);
};

const handleReset = () => {
  socket.emit(MatchRequestMessages.Restart);
  matchesStore.setMatchStatus(MatchStatus.NotStarted);
};

const handleStop = () => {
  socket.emit(MatchRequestMessages.Stop);
  matchesStore.setMatchStatus(MatchStatus.Finished);
};

export const handleClick = (matchStatus: MatchStatus) => {
  switch (matchStatus) {
    case MatchStatus.NotStarted:
      handleStart();
      break;

    case MatchStatus.Running:
      handleStop();
      break;

    case MatchStatus.Finished:
      handleReset();
      break;

    default:
      break;
  }
};
