//PdfProcessor pdfProcessor = new PdfProcessor();
//pdfProcessor.GetCtpTimeTable(@"orar_25.pdf");

var httpClient = new HttpClient();
var response = await httpClient.GetAsync("https://ctpcj.ro/orare/csv/orar_25_lv.csv");

var content = await response.Content.ReadAsStringAsync();
File.WriteAllText("orar_25.html", content);

Console.WriteLine(content);
