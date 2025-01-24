export function getMessageForNotesAnalyze(entries){
    const formattedEntries = entries.map(entry => {
        return `Title: ${entry.title}\nDate: ${entry.date}\nDescription: ${entry.content}`;
    }).join("\n\n");
    return [
        { role: "system", content: "You are a helpful assistant that summarizes school notes. Be concise and provide an insightful summary." },
        { role: "user", content: `Summarize these school notes:\n\n${formattedEntries}` },
    ]
}
