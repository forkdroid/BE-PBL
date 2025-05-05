# Air Quality Dashboard

A real-time air pollutants monitoring dashboard built with React, Tailwind CSS, and Recharts.

## Features

- Real-time monitoring of multiple air pollutants (CO, NO2, SO2, PM2.5, O3, PM10)
- Interactive charts for visualizing current and historical data
- Responsive design that works on all devices
- WebSocket integration for live data updates

## Technologies Used

- React for the UI framework
- Tailwind CSS for styling
- Recharts for data visualization
- Socket.io for real-time data communication

## Getting Started

1. Clone this repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm start
   ```
4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser

## WebSocket Integration

The dashboard is designed to work with a WebSocket server for real-time updates. For demonstration purposes, the application uses mock data with simulated updates. To connect to a real WebSocket server:

1. Update the `SOCKET_URL` in `src/services/websocketService.js`
2. Set `useRealWebsocket` to `true` in `src/App.js`

## Project Structure

- `/src/components` - React components
- `/src/services` - WebSocket and data services
- `/src/mockData.js` - Sample data for development

