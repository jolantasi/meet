import { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { PieChart, Pie, ResponsiveContainer, Cell } from 'recharts';

const EventGenresChart = ({ events }) => {
  const [data, setData] = useState([]);
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);

  const genres = ['React', 'JavaScript', 'Node', 'jQuery', 'Angular'];
  const colors = ['#D32F2F', '#1976D2', '#388E3C', '#FBC02D', '#7B1FA2']; // visible on white bg

  const getData = () => {
    return genres.map((genre) => {
      const filteredEvents = events.filter((event) =>
        event.summary.includes(genre)
      );
      return { name: genre, value: filteredEvents.length };
    });
  };

  useEffect(() => {
    setData(getData());
  }, [events]);

  // Wait until container has a valid size
  useLayoutEffect(() => {
    const checkSize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) setReady(true);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  const renderCustomizedLabel = ({ cx, cy, midAngle, outerRadius, percent, index }) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius * 1.1;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return percent ? (
      <text
        x={x}
        y={y}
        fill="#000000" // black labels for white background
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        style={{ fontSize: '12px' }}
      >
        {`${data[index].name} ${(percent * 100).toFixed(0)}%`}
      </text>
    ) : null;
  };

  // Don’t render chart until container has valid size
  if (!ready) {
    return <div ref={containerRef} style={{ width: '100%', minWidth: 300, height: 400 }} />;
  }

  return (
    <div ref={containerRef} style={{ width: '100%', minWidth: 300, height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            label={renderCustomizedLabel}
            labelLine={false}
            outerRadius={150}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EventGenresChart;
