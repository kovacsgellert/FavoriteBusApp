using FavoriteBusApp.Api.Common;

public static class OperationResultExtensions
{
    public static IResult ToResult(this OperationResult result)
    {
        return result.IsValid ? Results.Ok(result) : Results.BadRequest(result);
    }

    public static IResult ToResult<T>(this OperationResult<T> result)
    {
        return result.IsValid ? Results.Ok(result) : Results.BadRequest(result);
    }
}
