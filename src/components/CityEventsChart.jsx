// src/components/CityEventsChart.jsx
import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis, YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const CityEventsChart = ({ allLocations, events }) => {
  const [data, setData] = useState([]);
  const [ready, setReady] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const data = allLocations.map((location) => {
      const count = events.filter((event) => event.location === location).length;
      const city = location.split(/, | - /)[0];
      return { city, count };
    });
    setData(data);
  }, [events, allLocations]);

  // Wait until container has valid size
  useLayoutEffect(() => {
    const checkSize = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (rect && rect.width > 0 && rect.height > 0) setReady(true);
    };
    checkSize();
    window.addEventListener('resize', checkSize);
    return () => window.removeEventListener('resize', checkSize);
  }, []);

  if (!ready) {
    return <div ref={containerRef} style={{ width: '100%', minWidth: 320, height: 400 }} />;
  }

  return (
    <div ref={containerRef} style={{ width: '100%', minWidth: 320, height: 400 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 60,
            left: -30,
          }}
        >
          <CartesianGrid stroke="#ccc" />
          <XAxis
            type="category"
            dataKey="city"
            name="City"
            angle={60}
            interval={0}
            tick={{ dx: 20, dy: 40, fontSize: 14 }}
          />
          <YAxis
            type="number"
            dataKey="count"
            name="Number of events"
            allowDecimals={false}
          />
          <Tooltip cursor={{ strokeDasharray: '3 3' }} />
          <Scatter name="Events" data={data} fill="#1976D2" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CityEventsChart;
