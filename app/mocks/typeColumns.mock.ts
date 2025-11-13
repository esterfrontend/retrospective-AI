import type { RetrospectiveResponse } from "~/models/retrospective";

export const typeColumnsMock: RetrospectiveResponse = {
    retroType: "columns",
    columns: [
    {
        id: "start",
        label: "Start",
        description: "Things we should start doing",
        color: "#8adeae",
    },
    {
        id: "stop",
        label: "Stop",
        description: "Things we should stop doing",
        color: "#ff9c9c",
    },
    {
        id: "continue",
        label: "Continue",
        description: "Things we should continue doing",
        color: "#a8c2ec",
    },
    ],
    instructions:
    "This is a mock response for demonstration purposes. The Start/Stop/Continue format is ideal for teams looking to identify actionable improvements. Use the Start column for new practices, Stop for things to eliminate, and Continue for what's working well.",
    suggestions:
    "Focus on specific, actionable items. Be honest and constructive. Prioritize items that will have the most impact on team productivity and satisfaction.",
}