export default function Timetable({ header, values }: TimetableProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden shadow-md sm:rounded-lg">
      {/* Fixed header outside the scrollable area */}
      <div className="bg-gray-50 px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
        {header}
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
          <tbody>
            {values.map((value, index) => (
              <tr
                key={index}
                className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <td className="px-6 py-4">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

type TimetableProps = {
  header: string;
  values: string[];
};
