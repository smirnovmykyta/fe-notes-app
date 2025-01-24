import {Cell, Legend, Pie, PieChart, Tooltip} from "recharts";
import {useEffect, useState} from "react";

const Charts = ({ aiSummary }) => {
    const [sentimentData, setSentimentData] = useState([]);

    useEffect(() => {

        const sentimentCount = aiSummary.reduce((acc, entry) => {
            acc[entry.sentiment] = (acc[entry.sentiment] || 0) + 1;
            return acc;
        }, {});
        
        const data = [
            { name: "Positive", value: sentimentCount["positive"] || 0 },
            { name: "Neutral", value: sentimentCount["neutral"] || 0 },
            { name: "Negative", value: sentimentCount["negative"] || 0 },
        ];

        setSentimentData(data); 
    }, [aiSummary]);

    const COLORS = ["#00C49F", "#FFBB28", "#FF8042"];

    return (
      <div>
        <PieChart width={400} height={400}>
        <Pie
            data={sentimentData}
            dataKey="value"
            nameKey="name"
            outerRadius={150}
            fill="#8884d8"
            label
        >
          {sentimentData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index]} />
          ))}
        </Pie>
        <Legend />
        <Tooltip />
      </PieChart>
      </div>
  );
};

export default Charts;
