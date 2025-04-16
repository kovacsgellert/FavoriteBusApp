export default function Timetable({ header, values }: TimetableProps) {
  return (
    <div className="overflow-y-auto shadow-md sm:rounded-lg">
      <table className="w-full text-center text-sm text-gray-500 dark:text-gray-400">
        <thead className="sticky top-0 bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              {header}
            </th>
          </tr>
        </thead>
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
  );
}

type TimetableProps = {
  header: string;
  values: string[];
};
