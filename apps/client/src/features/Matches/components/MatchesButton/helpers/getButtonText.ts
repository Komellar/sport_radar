import { MatchStatus } from "@features/Matches/types";

export const getButtonText = (matchStatus: MatchStatus) => {
  switch (matchStatus) {
    case MatchStatus.NotStarted:
      return "Start";

    case MatchStatus.Running:
      return "Finish";

    case MatchStatus.Finished:
      return "Reset";

    default:
      return "";
  }
};
