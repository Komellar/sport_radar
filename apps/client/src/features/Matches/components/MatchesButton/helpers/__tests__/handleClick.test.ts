import { vi } from "vitest";

import { MatchStatus, MatchRequestMessages } from "@features/Matches/types";
import { matchesStore } from "@store/MatchesStore";
import { socket } from "@common/socket";
import { handleClick } from "../handleClick";

vi.mock("@common/socket", () => ({
  socket: {
    emit: vi.fn(),
  },
}));

vi.mock("@store/MatchesStore", () => ({
  matchesStore: {
    setMatchStatus: vi.fn(),
  },
}));

describe("handleClick", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it("should handle a click for MatchStatus.NotStarted", () => {
    handleClick(MatchStatus.NotStarted);

    expect(socket.emit).toHaveBeenCalledWith(MatchRequestMessages.Start);
    expect(matchesStore.setMatchStatus).toHaveBeenCalledWith(
      MatchStatus.Running
    );
  });

  it("should handle a click for MatchStatus.Running", () => {
    handleClick(MatchStatus.Running);

    expect(socket.emit).toHaveBeenCalledWith(MatchRequestMessages.Stop);
    expect(matchesStore.setMatchStatus).toHaveBeenCalledWith(
      MatchStatus.Finished
    );
  });

  it("should handle a click for MatchStatus.Finished", () => {
    handleClick(MatchStatus.Finished);

    expect(socket.emit).toHaveBeenCalledWith(MatchRequestMessages.Restart);
    expect(matchesStore.setMatchStatus).toHaveBeenCalledWith(
      MatchStatus.NotStarted
    );
  });

  it("should do nothing for an unknown match status", () => {
    handleClick("UnknownStatus" as MatchStatus);

    expect(socket.emit).not.toHaveBeenCalled();
    expect(matchesStore.setMatchStatus).not.toHaveBeenCalled();
  });
});
