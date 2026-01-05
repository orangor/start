import React, { useState, useEffect } from 'react';
import { Card, Typography, message } from 'antd';
import { HotlistEntriesService } from '../../api';
import type { HotlistEntry, HotlistEntryListParams, HotlistEntryListResponse } from '../../api';
import HotlistEntriesSearch from './HotlistEntriesSearch';
import HotlistEntriesTable from './HotlistEntriesTable';
import HotlistEntriesForm from './HotlistEntriesForm';
import { getRecordId } from './utils';

const { Title } = Typography;

interface HotlistEntriesProps {
  className?: string;
}

const HotlistEntries: React.FC<HotlistEntriesProps> = ({ className }) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<HotlistEntry[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState<HotlistEntryListParams>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<HotlistEntry | null>(null);

  // 平台选项
  const platformOptions = [
    { label: '全部平台', value: '' },
    { label: '微博', value: '微博' },
    { label: '知乎', value: '知乎' },
    { label: '抖音', value: '抖音' },
    { label: 'B站', value: 'B站' },
    { label: '小红书', value: '小红书' },
  ];

  // 获取数据
  const fetchData = async (params?: HotlistEntryListParams) => {
    setLoading(true);
    try {
      const response: HotlistEntryListResponse = await HotlistEntriesService.list({
        page: pagination.current,
        limit: pagination.pageSize,
        ...searchParams,
        ...params,
      });

      const items = response.items ?? [];
      const normalized = (items as any[]).map((it) => ({
        ...it,
        id: it.id ?? it.entry_id,
      }));

      setData(normalized as HotlistEntry[]);
      setPagination((prev) => ({
        ...prev,
        total: response.total ?? 0,
      }));
    } catch (error) {
      message.error('获取数据失败');
      console.error('Fetch data error:', error);
    } finally {
      setLoading(false);
    }
  };

  // 处理表格变化
  const handleTableChange = (newPagination: any, _filters: any, sorter: any) => {
    const newParams: HotlistEntryListParams = {
      page: newPagination.current,
      limit: newPagination.pageSize,
    };

    if (sorter && sorter.field) {
      newParams.sortBy = sorter.field as HotlistEntryListParams['sortBy'];
      newParams.sortOrder = sorter.order === 'ascend' ? 'asc' : 'desc';
    }

    setPagination((prev) => ({
      ...prev,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));
    fetchData(newParams);
  };

  // 搜索处理（接收子组件传入的已构造参数）
  const handleSearch = (params: HotlistEntryListParams) => {
    setSearchParams(params);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData({ ...params, page: 1 });
  };

  // 重置搜索（由子组件 reset 表单）
  const handleReset = () => {
    setSearchParams({});
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData({ page: 1 });
  };

  // 删除处理
  const handleDelete = async (id: number) => {
    try {
      await HotlistEntriesService.delete(id);
      message.success('删除成功');
      fetchData();
    } catch (error) {
      message.error('删除失败');
      console.error('Delete error:', error);
    }
  };

  // 编辑处理
  const handleEdit = (record: HotlistEntry) => {
    setEditingRecord(record);
    setModalVisible(true);
  };

  // 新增处理
  const handleAdd = () => {
    setEditingRecord(null);
    setModalVisible(true);
  };

  // 模态框提交
  const handleModalSubmit = async (values: any) => {
    try {
      if (editingRecord) {
        const id = getRecordId(editingRecord);
        if (id === undefined) {
          message.error('当前记录缺少ID，无法更新');
          return;
        }
        await HotlistEntriesService.update(id, values);
        message.success('更新成功');
      } else {
        await HotlistEntriesService.create(values);
        message.success('创建成功');
      }
      setModalVisible(false);
      fetchData();
    } catch (error) {
      message.error(editingRecord ? '更新失败' : '创建失败');
      console.error('Submit error:', error);
    }
  };

  // 初始化加载数据
  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className}>
      <Card>
        <Title level={3} style={{ marginBottom: 24 }}>
          热榜条目管理
        </Title>

        {/* 搜索表单 → 子组件 */}
        <HotlistEntriesSearch
          platformOptions={platformOptions}
          onSearch={handleSearch}
          onReset={handleReset}
          onAdd={handleAdd}
        />

        {/* 数据表格 → 子组件 */}
        <HotlistEntriesTable
          data={data}
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </Card>

      {/* 编辑/新增模态框 → 子组件 */}
      <HotlistEntriesForm
        visible={modalVisible}
        record={editingRecord}
        platformOptions={platformOptions}
        onSubmit={handleModalSubmit}
        onCancel={() => setModalVisible(false)}
      />
    </div>
  );
};

export default HotlistEntries;