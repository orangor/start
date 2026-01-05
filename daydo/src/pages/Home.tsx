import React from 'react';
import { Card } from 'antd';
import Chat from '../components/chat/Chat';
import HotlistEntries from '../components/HotlistEntries';
import './TaskDashboard.css';

const Home: React.FC = () => {
  return (
    <div style={{ padding: '24px', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card style={{  margin: '0 auto' }}>
        <HotlistEntries />
      </Card>
      
    </div>
  );
};

export default Home;