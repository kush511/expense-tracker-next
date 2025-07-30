'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useTheme } from '@/contexts/ThemeContext';
import { useState, useEffect } from 'react';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define the type for a record
interface Record {
  date: string; // ISO date string
  Amount: number; // Amount spent
  category: string; // Expense category
}

const BarChart = ({ records }: { records: Record[] }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [windowWidth, setWindowWidth] = useState(1024); // Default to desktop width

  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);

    // Add resize listener
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isMobile = windowWidth < 640;

  // Aggregate expenses by date
  const aggregateByDate = (records: Record[]) => {
    const dateMap = new Map<
      string,
      { total: number; categories: string[]; originalDate: string }
    >();

    records.forEach((record) => {
      // Parse the date string properly and extract just the date part (YYYY-MM-DD)
      const dateObj = new Date(record.date);
      // Use UTC methods to avoid timezone issues
      const year = dateObj.getUTCFullYear();
      const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getUTCDate()).padStart(2, '0');
      const dateKey = `${year}-${month}-${day}`;
      const existing = dateMap.get(dateKey);

      if (existing) {
        existing.total += record.Amount;
        if (!existing.categories.includes(record.category)) {
          existing.categories.push(record.category);
        }
      } else {
        dateMap.set(dateKey, {
          total: record.Amount,
          categories: [record.category],
          originalDate: record.date, // Keep original ISO date for sorting
        });
      }
    });

    // Convert to array and sort by date (oldest to newest)
    return Array.from(dateMap.entries())
      .map(([date, data]) => ({
        date,
        amount: data.total,
        categories: data.categories,
        originalDate: data.originalDate,
      }))
      .sort(
        (a, b) =>
          new Date(a.originalDate).getTime() -
          new Date(b.originalDate).getTime()
      );
  };

  const aggregatedData = aggregateByDate(records);

  // Get color based on amount (Indian rupee context)
  const getAmountColor = (amount: number) => {
    if (amount > 5000)
      return {
        bg: isDark ? 'rgba(255, 153, 51, 0.3)' : 'rgba(255, 153, 51, 0.2)',
        border: isDark ? 'rgba(255, 153, 51, 0.8)' : 'rgba(255, 153, 51, 1)',
      }; // Saffron for very high spending
    if (amount > 2000)
      return {
        bg: isDark ? 'rgba(0, 128, 0, 0.3)' : 'rgba(0, 128, 0, 0.2)',
        border: isDark ? 'rgba(0, 128, 0, 0.8)' : 'rgba(0, 128, 0, 1)',
      }; // Green for high spending
    if (amount > 1000)
      return {
        bg: isDark ? 'rgba(54, 162, 235, 0.3)' : 'rgba(54, 162, 235, 0.2)',
        border: isDark ? 'rgba(54, 162, 235, 0.8)' : 'rgba(54, 162, 235, 1)',
      }; // Blue for medium spending
    if (amount > 500)
      return {
        bg: isDark ? 'rgba(75, 192, 192, 0.3)' : 'rgba(75, 192, 192, 0.2)',
        border: isDark ? 'rgba(75, 192, 192, 0.8)' : 'rgba(75, 192, 192, 1)',
      }; // Teal for low spending
    return {
      bg: isDark ? 'rgba(201, 203, 207, 0.3)' : 'rgba(201, 203, 207, 0.2)',
      border: isDark ? 'rgba(201, 203, 207, 0.8)' : 'rgba(201, 203, 207, 1)',
    }; // Grey for minimal spending
  };

  // Prepare data for the chart
  const data = {
    labels: aggregatedData.map((item) => {
      // Format date as MM/DD for better readability
      const [, month, day] = item.date.split('-');
      return `${day}/${month}`;
    }),
    datasets: [
      {
        data: aggregatedData.map((item) => item.amount),
        backgroundColor: aggregatedData.map(
          (item) => getAmountColor(item.amount).bg
        ),
        borderColor: aggregatedData.map(
          (item) => getAmountColor(item.amount).border
        ),
        borderWidth: 1,
        borderRadius: 2, // Rounded bar edges
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allow flexible height
    plugins: {
      legend: {
        display: false, // Remove legend
      },
      title: {
        display: false, // Remove chart title
      },
      tooltip: {
        backgroundColor: isDark
          ? 'rgba(31, 41, 55, 0.95)'
          : 'rgba(255, 255, 255, 0.95)',
        titleColor: isDark ? '#f9fafb' : '#1f2937',
        bodyColor: isDark ? '#d1d5db' : '#374151',
        borderColor: isDark ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function (context: { dataIndex: number }) {
            const dataIndex = context.dataIndex;
            const item = aggregatedData[dataIndex];
            const categoriesText =
              item.categories.length > 1
                ? `Categories: ${item.categories.join(', ')}`
                : `Category: ${item.categories[0]}`;
            return [`Total: ₹${item.amount.toFixed(2)}`, categoriesText];
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Date',
          font: {
            size: isMobile ? 12 : 14,
            weight: 'bold' as const,
          },
          color: isDark ? '#d1d5db' : '#2c3e50',
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12,
          },
          color: isDark ? '#9ca3af' : '#7f8c8d', // Gray x-axis labels
          maxRotation: isMobile ? 45 : 0, // Rotate labels on mobile
          minRotation: isMobile ? 45 : 0,
        },
        grid: {
          display: false, // Hide x-axis grid lines
        },
      },
      y: {
        title: {
          display: true,
          text: 'Amount (₹)',
          font: {
            size: isMobile ? 12 : 16, // Smaller font on mobile
            weight: 'bold' as const,
          },
          color: isDark ? '#d1d5db' : '#2c3e50',
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12, // Smaller font on mobile
          },
          color: isDark ? '#9ca3af' : '#7f8c8d', // Gray y-axis labels
          callback: function (value: string | number) {
            return '₹' + value; // Add rupee sign to y-axis labels
          },
        },
        grid: {
          color: isDark ? '#374151' : '#e0e0e0', // Dark mode grid lines
        },
        beginAtZero: true, // Start y-axis at zero for expenses
      },
    },
  };

  return (
    <div className='relative w-full h-64 sm:h-72 md:h-80'>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;