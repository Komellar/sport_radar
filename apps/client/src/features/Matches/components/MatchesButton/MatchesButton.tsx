import { observer } from "mobx-react";

import { matchesStore } from "@store/MatchesStore";
import { getButtonText, handleClick } from "./helpers";

export const MatchesButton = observer(() => {
  const buttonText = getButtonText(matchesStore.matchStatus);

  return (
    <button onClick={() => handleClick(matchesStore.matchStatus)}>
      {buttonText}
    </button>
  );
});
