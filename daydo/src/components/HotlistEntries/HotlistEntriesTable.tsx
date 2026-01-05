import React, { useMemo, useState } from 'react';
import { Table, Space, Tag, Button, Tooltip, Typography, Badge, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, LinkOutlined, FireOutlined, CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import type { HotlistEntry } from '../../api';
import type { HotlistEntriesTableProps } from './types';
import moment from 'moment';
import { getLatestHeat, getHeatTrend, getRecordId } from './utils';

const { Text } = Typography;

// 简易 SVG 折线图组件
const TrendChart: React.FC<{ times: number[]; heats: number[]; width?: number; height?: number }> = ({ times, heats, width = 640, height = 320 }) => {
  const padding = 40;
  const n = heats.length;

  if (n === 0) {
    return <div style={{ padding: 16 }}>暂无趋势数据</div>;
  }

  const minHeat = Math.min(...heats);
  const maxHeat = Math.max(...heats);
  const heatRange = maxHeat === minHeat ? 1 : (maxHeat - minHeat);

  const points = heats.map((h, i) => {
    const x = padding + (n === 1 ? (width - 2 * padding) / 2 : (i * (width - 2 * padding) / (n - 1)));
    const y = padding + ((maxHeat - h) / heatRange) * (height - 2 * padding);
    return { x, y };
  });

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ');

  const timeLabels = times.map(ts => moment.unix(ts).format('MM-DD HH:mm'));

  return (
    <svg width={width} height={height} style={{ background: '#fff' }}>
      {/* 边框与轴线 */}
      <rect x={padding} y={padding} width={width - 2 * padding} height={height - 2 * padding} fill="none" stroke="#e8e8e8" />
      {/* 折线 */}
      <polyline points={polyline} fill="none" stroke="#1890ff" strokeWidth={2} />
      {/* 节点与标签 */}
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r={3} fill="#1890ff" />
          {/* 热度值 */}
          <text x={p.x} y={p.y - 8} fontSize="10" textAnchor="middle" fill="#555">{heats[i]}</text>
          {/* 时间标签 */}
          <text x={p.x} y={height - padding + 14} fontSize="10" textAnchor="middle" fill="#888">{timeLabels[i]}</text>
        </g>
      ))}
    </svg>
  );
};

const HotlistEntriesTable: React.FC<HotlistEntriesTableProps> = ({ data, loading, pagination, onChange, onEdit, onDelete }) => {
  // 趋势图模态框状态
  const [chartVisible, setChartVisible] = useState(false);
  const [chartTimes, setChartTimes] = useState<number[]>([]);
  const [chartHeats, setChartHeats] = useState<number[]>([]);
  const [chartTitle, setChartTitle] = useState<string>('热度趋势');

  const openTrendModal = (record: HotlistEntry) => {
    const times = (record.times || '')
      .split(',')
      .map(t => parseInt(t))
      .filter(v => !isNaN(v));
    const heats = (record.heat || '')
      .split(',')
      .map(h => parseInt(h))
      .filter(v => !isNaN(v));
    setChartTimes(times);
    setChartHeats(heats);
    setChartTitle(record.title || '热度趋势');
    setChartVisible(true);
  };

  const columns: ColumnsType<HotlistEntry> = [
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
      filters: [
        { text: '微博', value: '微博' },
        { text: '知乎', value: '知乎' },
        { text: '抖音', value: '抖音' },
        { text: 'B站', value: 'B站' },
        { text: '小红书', value: '小红书' },
      ],
      render: (platform: string) => (
        <Tag color={
          platform === '微博' ? '#ff4757' :
          platform === '知乎' ? '#0066cc' :
          platform === '抖音' ? '#000' :
          platform === 'B站' ? '#00a1d6' :
          '#ff6b6b'
        }>
          {platform}
        </Tag>
      ),
    },
    {
      title: '标题',
      dataIndex: 'title',
      key: 'title',
      ellipsis: { showTitle: false },
      render: (title: string, record: HotlistEntry) => (
        <Tooltip title={title}>
          <Text style={{ maxWidth: 300 }} ellipsis>
            {title}
          </Text>
        </Tooltip>
      ),
    },
    {
      title: '排名',
      dataIndex: 'rank',
      key: 'rank',
      width: 120,
      render: (rank: string) => {
        const ranks = rank ? rank.split(',').map(r => parseInt(r) || 0) : [];
        const validRanks = ranks.filter(r => r > 0);
        const bestRank = validRanks.length > 0 ? Math.min(...validRanks) : 0;
        return (
          <Space>
            <Badge 
              count={bestRank} 
              style={{ backgroundColor: bestRank <= 10 ? '#52c41a' : bestRank <= 30 ? '#faad14' : '#ff4d4f' }}
            />
          </Space>
        );
      },
    },
    {
      title: '热度',
      dataIndex: 'heat',
      key: 'heat',
      width: 160,
      sorter: true,
      render: (heat: string, record: HotlistEntry) => {
        const latestHeat = getLatestHeat(heat);
        const trend = getHeatTrend(heat);
        return (
          <Space onClick={() => openTrendModal(record)} style={{ cursor: 'pointer' }}>
            <FireOutlined style={{ 
              color: latestHeat > 100000 ? '#ff4757' : 
                     latestHeat > 50000 ? '#ffa502' : '#2ed573'
            }} />
            <Text strong>{latestHeat.toLocaleString()}</Text>
            {trend === 'up' && <span style={{ color: '#52c41a' }}>↗</span>}
            {trend === 'down' && <span style={{ color: '#ff4d4f' }}>↘</span>}
          </Space>
        );
      },
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 120,
      render: (date: string) => (
        <Space>
          <CalendarOutlined />
          <Text>{moment(date).format('MM-DD')}</Text>
        </Space>
      ),
    },
    {
      title: '链接',
      key: 'url',
      width: 80,
      render: (_, record: HotlistEntry) => (
        <Button
          type="link"
          icon={<LinkOutlined />}
          onClick={() => window.open(record.url, '_blank')}
          size="small"
        >
          查看
        </Button>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 120,
      fixed: 'right',
      render: (_, record: HotlistEntry) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => onEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              const id = getRecordId(record);
              if (id === undefined) return;
              onDelete(id);
            }}
            size="small"
          >
            删除
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `共 ${total} 条记录`,
        }}
        onChange={onChange}
        scroll={{ x: 1000 }}
        style={{ marginTop: 16 }}
      />

      <Modal
        open={chartVisible}
        title={chartTitle}
        footer={null}
        onCancel={() => setChartVisible(false)}
        width={720}
      >
        <TrendChart times={chartTimes} heats={chartHeats} />
      </Modal>
    </>
  );
};

export default HotlistEntriesTable;