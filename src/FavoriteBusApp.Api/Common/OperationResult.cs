namespace FavoriteBusApp.Api.Common;

public class OperationResult
{
    public List<string> Errors = [];
    public bool IsValid => Errors.Count == 0;

    public static OperationResult Ok() => new();

    public static OperationResult Fail(string error) => new() { Errors = [error] };

    public static OperationResult Fail(List<string> errors) => new() { Errors = errors };
}

public class OperationResult<T> : OperationResult
{
    public T? Data { get; set; }

    public static OperationResult<T> Ok(T data) => new() { Data = data };

    public static new OperationResult<T> Fail(string error) => new() { Errors = [error] };

    public static new OperationResult<T> Fail(List<string> errors) => new() { Errors = errors };
}
