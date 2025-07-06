import { useRef } from "react";

/**
 * usePressActions - Robust custom hook for handling short and long press actions.
 * @param onShortPress Function to call on short press (click/tap)
 * @param onLongPress Function to call on long press/touch
 * @param longPressDuration Duration in ms to trigger long press (default: 500ms)
 */
export function usePressActions(
  onShortPress: () => void,
  onLongPress: () => void,
  longPressDuration = 500
) {
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pressStartTime = useRef<number | null>(null);
  const longPressFired = useRef(false);
  const moved = useRef(false);

  const clear = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const start = () => {
    longPressFired.current = false;
    pressStartTime.current = Date.now();
    moved.current = false;
    clear();
    timerRef.current = setTimeout(() => {
      longPressFired.current = true;
      onLongPress();
    }, longPressDuration);
  };

  const end = () => {
    clear();
    if (!longPressFired.current && pressStartTime.current && !moved.current) {
      const duration = Date.now() - pressStartTime.current;
      if (duration < longPressDuration) {
        onShortPress();
      }
    }
    pressStartTime.current = null;
    longPressFired.current = false;
    moved.current = false;
  };

  const onMouseDown = () => start();
  const onMouseUp = () => end();
  const onMouseLeave = () => end();
  const onTouchStart = () => start();
  const onTouchEnd = () => end();
  const onTouchCancel = () => end();
  const onTouchMove = () => {
    if (!moved.current) {
      moved.current = true;
      clear();
    }
  };

  return {
    onMouseDown,
    onMouseUp,
    onMouseLeave,
    onTouchStart,
    onTouchEnd,
    onTouchCancel,
    onTouchMove,
  };
}
