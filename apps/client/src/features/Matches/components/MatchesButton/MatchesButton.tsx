import { observer } from "mobx-react";

import { matchesStore } from "@store/MatchesStore";
import { getButtonText, handleClick } from "./helpers";
import { Button } from "./MatchesButton.styled";

export const MatchesButton = observer(() => {
  const buttonText = getButtonText(matchesStore.matchStatus);

  return (
    <Button onClick={() => handleClick(matchesStore.matchStatus)}>
      {buttonText}
    </Button>
  );
});
