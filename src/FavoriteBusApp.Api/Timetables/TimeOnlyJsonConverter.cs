using System.Text.Json.Serialization;

namespace FavoriteBusApp.Api.Timetables;

public class TimeOnlyConverter : JsonConverter<TimeOnly>
{
    private const string _timeFormat = "HH:mm";

    public override TimeOnly Read(
        ref Utf8JsonReader reader,
        Type typeToConvert,
        JsonSerializerOptions options
    )
    {
        var timeString = reader.GetString();
        return timeString != null ? TimeOnly.Parse(timeString) : default;
    }

    public override void Write(Utf8JsonWriter writer, TimeOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(_timeFormat));
    }
}
