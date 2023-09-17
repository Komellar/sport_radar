import { MatchStatus } from "@features/Matches/types";
import { getButtonText } from "../getButtonText";

describe("getButtonText", () => {
  it('should return "Start" when matchStatus is MatchStatus.NotStarted', () => {
    const result = getButtonText(MatchStatus.NotStarted);
    expect(result).toBe("Start");
  });

  it('should return "Finish" when matchStatus is MatchStatus.Running', () => {
    const result = getButtonText(MatchStatus.Running);
    expect(result).toBe("Finish");
  });

  it('should return "Reset" when matchStatus is MatchStatus.Finished', () => {
    const result = getButtonText(MatchStatus.Finished);
    expect(result).toBe("Reset");
  });

  it("should return an empty string when matchStatus is unknown", () => {
    const result = getButtonText("UnknownStatus" as MatchStatus);
    expect(result).toBe("");
  });
});
