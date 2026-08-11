'use client';
import { Doughnut } from 'react-chartjs-2';
import './chartSetup';
import { cn } from '@/utils/helpers';

export default function DoughnutChart({ labels, values, colors, height = 'h-64' }) {
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderWidth: 2,
        borderColor: '#ffffff',
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '64%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: { usePointStyle: true, boxWidth: 8, boxHeight: 8, padding: 18, font: { size: 12 } },
      },
      tooltip: {
        backgroundColor: '#0f172a',
        padding: 12,
        cornerRadius: 10,
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.parsed} siswa`,
        },
      },
    },
  };

  return (
    <div className={cn('relative', height)}>
      <Doughnut data={data} options={options} />
    </div>
  );
}
