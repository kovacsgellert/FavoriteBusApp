import { useEffect, useState } from "react";

interface CountdownProps {
  seconds: number;
  lastUpdated: Date;
}

export default function Countdown({ seconds, lastUpdated }: CountdownProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds, lastUpdated]);

  useEffect(() => {
    if (remaining === 0) return;
    const interval = setInterval(() => {
      setRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [remaining]);

  return <span>{remaining} s</span>;
}
