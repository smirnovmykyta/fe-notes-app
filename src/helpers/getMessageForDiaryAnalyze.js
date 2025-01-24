export function getMessageForDiaryAnalyze(entries){
    const formattedEntries = entries.map(entry => {
        return `Title: ${entry.title}\nDate: ${entry.date}\nDescription: ${entry.content}`;
    }).join("\n\n");
    return [
        {
            role: "system",
            content: "You are a helpful assistant that performs sentiment analysis on diary entries. Respond in JSON format."
        },
        {
            role: "user",
            content: `Analyze the sentiment of these diary entries:\n\n${formattedEntries}\n\nReturn the result as a JSON object with:
1. A detailed 'overall_sentiment' field explaining the general emotional tone across all entries, including why this sentiment was chosen.
2. A breakdown of sentiment for each entry with fields 'title', 'date', 'sentiment' (positive/neutral/negative), and 'summary' (a short explanation of the sentiment classification).`
        }
    ]
}
