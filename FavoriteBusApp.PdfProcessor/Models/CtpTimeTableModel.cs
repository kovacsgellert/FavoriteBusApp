public class CtpTimeTableModel
{
    public required string LineNumber { get; set; }
    public required List<string> MondayToFridayStartTimes { get; set; } = [];
    public required List<string> SaturdayStartTimes { get; set; } = [];
    public required List<string> SundayStartTimes { get; set; } = [];
}
