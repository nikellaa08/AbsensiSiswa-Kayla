'use client';
import { Bar } from 'react-chartjs-2';
import './chartSetup';
import { cn } from '@/utils/helpers';

export default function BarChart({
  labels,
  datasets,
  height = 'h-64',
  stacked = false,
  horizontal = false,
  maxTicksLimit = 12,
}) {
  const data = {
    labels,
    datasets: datasets.map((d) => ({
      ...d,
      borderRadius: 6,
      borderSkipped: false,
      maxBarThickness: 42,
    })),
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: horizontal ? 'y' : 'x',
    plugins: {
      legend: {
        position: 'top',
        labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8, padding: 16, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 10,
      },
    },
    scales: {
      x: { grid: { display: false }, stacked, ticks: { font: { size: 11 }, maxTicksLimit } },
      y: {
        stacked,
        beginAtZero: true,
        grid: { color: 'rgba(226, 232, 240, 0.5)' },
        ticks: { precision: 0, font: { size: 11 } },
      },
    },
  };

  return (
    <div className={cn('relative', height)}>
      <Bar data={data} options={options} />
    </div>
  );
}
