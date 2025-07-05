export default function Chip({
  label,
  selected,
  onClick,
  selectedColor,
  unselectedColor,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
  selectedColor: string;
  unselectedColor: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-1.5 py-0.5 rounded-full text-sm font-semibold shadow-md border-2 transition-all duration-150 mr-1 mb-1 focus:outline-none focus:ring-2 focus:ring-blue-400 ${
        selected
          ? `${selectedColor} border-white/80 scale-105`
          : `${unselectedColor} border-white/30 hover:brightness-110`
      }`}
      style={{ minWidth: 60 }}
    >
      {label}
    </button>
  );
}
