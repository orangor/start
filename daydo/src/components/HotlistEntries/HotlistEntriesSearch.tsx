import React from 'react';
import { Form, Row, Col, Select, Input, DatePicker, Space, Button } from 'antd';
import { SearchOutlined, ReloadOutlined, PlusOutlined } from '@ant-design/icons';
import type { HotlistEntryListParams } from '../../api';
import type { HotlistEntriesSearchProps } from './types';

const { RangePicker } = DatePicker;
const { Option } = Select;

const HotlistEntriesSearch: React.FC<HotlistEntriesSearchProps> = ({ platformOptions, onSearch, onReset, onAdd }) => {
  const [form] = Form.useForm();

  const handleSearch = (values: any) => {
    const params: HotlistEntryListParams = {};
    if (values.platform) params.platform = values.platform;
    if (values.title) params.title = values.title;
    if (values.dateRange && values.dateRange.length === 2) {
      params.startDate = values.dateRange[0].format('YYYY-MM-DD');
      params.endDate = values.dateRange[1].format('YYYY-MM-DD');
    }
    onSearch(params);
  };

  const handleReset = () => {
    form.resetFields();
    onReset();
  };

  return (
    <Form form={form} onFinish={handleSearch} layout="vertical">
      <Row gutter={16}>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="platform" label="平台">
            <Select placeholder="选择平台" allowClear>
              {platformOptions.map(option => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="title" label="标题关键词">
            <Input placeholder="输入标题关键词" allowClear />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item name="dateRange" label="日期范围">
            <RangePicker style={{ width: '100%' }} />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Form.Item label=" " colon={false}>
            <Space>
              <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>搜索</Button>
              <Button onClick={handleReset} icon={<ReloadOutlined />}>重置</Button>
              <Button type="dashed" onClick={onAdd} icon={<PlusOutlined />}>新增</Button>
            </Space>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default HotlistEntriesSearch;