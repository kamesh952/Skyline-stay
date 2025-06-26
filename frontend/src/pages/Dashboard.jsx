import React from 'react';
import { Box, Typography, Paper, useTheme, useMediaQuery } from '@mui/material';
import { headerStyle, pageStyle, cardStyle } from '../styles';
import {
  People as PeopleIcon,
  Hotel as HotelIcon,
  CalendarToday as CalendarIcon,
  AttachMoney as MoneyIcon,
} from '@mui/icons-material';
import StatCard from '../components/StatCard';
import RecentBookings from '../components/RecentBookings';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Bar } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(...registerables);

export default function DashboardPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.between('sm', 'md'));

  // Example chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
    datasets: [
      {
        label: 'Revenue ($)',
        data: [12500, 19000, 15300, 21000, 18500, 22500, 24800],
        backgroundColor: '#4361ee',
        borderRadius: 4,
        borderSkipped: false,
        barPercentage: isMobile ? 0.3 : 0.6,
        categoryPercentage: isMobile ? 0.7 : 0.8
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#fff',
        titleColor: '#000',
        bodyColor: '#000',
        borderColor: '#ddd',
        borderWidth: 1,
        padding: 8,
        bodyFont: {
          size: isMobile ? 12 : 14
        },
        titleFont: {
          size: isMobile ? 12 : 14
        },
        callbacks: {
          label: function(context) {
            return `$${context.raw.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          font: {
            size: isMobile ? 10 : 12
          }
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: '#f0f0f0'
        },
        ticks: {
          callback: function(value) {
            return `$${value / 1000}k`;
          },
          font: {
            size: isMobile ? 10 : 12
          },
          maxTicksLimit: isMobile ? 5 : 8
        }
      }
    }
  };

  return (
    <Box sx={{ ...pageStyle, px: isMobile ? 1 : 3 }}>
      <Box sx={headerStyle}>
        <Typography variant={isMobile ? 'h6' : 'h4'} component="h1">
          Dashboard
        </Typography>
      </Box>

      {/* Stat Cards Row */}
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : 'repeat(4, 1fr)',
        gap: 2,
        mb: 3,
        width: '100%'
      }}>
        <StatCard
          icon={<PeopleIcon fontSize={isMobile ? 'small' : 'medium'} />}
          title="Total Guests"
          value="1,254"
          color="#4361ee"
          compact={isMobile}
        />
        <StatCard
          icon={<HotelIcon fontSize={isMobile ? 'small' : 'medium'} />}
          title="Available Rooms"
          value="42"
          color="#3f37c9"
          compact={isMobile}
        />
        <StatCard
          icon={<CalendarIcon fontSize={isMobile ? 'small' : 'medium'} />}
          title="Today's Bookings"
          value="18"
          color="#4895ef"
          compact={isMobile}
        />
        <StatCard
          icon={<MoneyIcon fontSize={isMobile ? 'small' : 'medium'} />}
          title="Today's Revenue"
          value="$5,420"
          color="#4cc9f0"
          compact={isMobile}
        />
      </Box>

      {/* Main Content Area */}
      <Box sx={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        gap: 2,
        width: '100%'
      }}>
        {/* Left Side - Recent Bookings */}
        <Box sx={{ 
          width: '100%',
          flex: isMobile ? '0 1 auto' : 1.8,
          order: isMobile ? 2 : 1
        }}>
          <RecentBookings compact={isMobile} />
        </Box>

        {/* Right Side - Revenue Chart */}
        <Box sx={{ 
          width: '100%',
          flex: isMobile ? '0 1 auto' : 1,
          order: isMobile ? 1 : 2
        }}>
          <Paper sx={{ 
            ...cardStyle, 
            p: isMobile ? 1.5 : 2, 
            height: '100%',
            minHeight: isMobile ? '280px' : 'auto'
          }}>
            <Typography variant={isMobile ? 'body1' : 'h6'} gutterBottom sx={{ fontWeight: 500 }}>
              Revenue Overview
            </Typography>
            <Box sx={{ 
              height: isMobile ? '220px' : '300px',
              mt: isMobile ? 0 : 1
            }}>
              <Bar data={chartData} options={chartOptions} />
            </Box>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}