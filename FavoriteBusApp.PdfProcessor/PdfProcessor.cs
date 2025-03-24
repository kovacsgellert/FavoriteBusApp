public class PdfProcessor
{
    public CtpTimeTableModel GetCtpTimeTable(string filePath)
    {
        return new CtpTimeTableModel
        {
            LineNumber = "25",
            MondayToFridayStartTimes = new List<string>
            {
                "06:00",
                "06:30",
                "07:00",
                "07:30",
                "08:00",
            },
            SaturdayStartTimes = new List<string> { "07:00", "07:30", "08:00", "08:30", "09:00" },
            SundayStartTimes = new List<string> { "08:00", "08:30", "09:00", "09:30", "10:00" },
        };
    }
}
