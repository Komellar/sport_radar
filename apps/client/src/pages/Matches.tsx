import { useState, useEffect } from "react";
import { socket } from "@common/socket";
import { Match } from "@features/Matches/types";
import { SingleMatch } from "@features/Matches/SingleMatch";

export const Matches = () => {
  const [matchTime, setMatchTime] = useState(0);
  const [matches, setMatches] = useState<Match[]>([]);

  const handleStart = () => {
    socket.emit("start");
  };

  const handleReset = () => {
    socket.emit("restart");
  };

  const handleStop = () => {
    socket.emit("stop");
  };

  useEffect(() => {
    socket.on("matches", (data) => {
      setMatches(data);
    });

    socket.on("time", (time) => {
      console.log(time);
      setMatchTime(time);
    });

    return () => {
      socket.off("matches");
      socket.off("time");
    };
  });

  return (
    <div>
      <h5>{matchTime}</h5>
      {matches.map((match) => {
        return <SingleMatch match={match} key={match.id} />;
      })}
      <button onClick={handleStart}>Start</button>
      <button onClick={handleReset}>Reset</button>
      <button onClick={handleStop}>Stop</button>
    </div>
  );
};
