import React from 'react';
import { Modal, Form, Select, Input, DatePicker, Space, Button } from 'antd';
import type { HotlistEntriesFormProps } from './types';
import dayjs from 'dayjs';

const { Option } = Select;

const HotlistEntriesForm: React.FC<HotlistEntriesFormProps> = ({ visible, record, platformOptions, onSubmit, onCancel }) => {
  const [form] = Form.useForm();
  // 初始化编辑表单的初始值，转换日期为 dayjs
  const formInitialValues = React.useMemo(() => {
    if (!record) return {} as any;
    const init: any = { ...record };
    if (record.date) {
      init.date = dayjs(record.date);
    }
    return init;
  }, [record]);

  const handleFinish = (values: any) => {
    const payload = {
      ...values,
      date: values.date ? values.date.format('YYYY-MM-DD') : undefined,
    };
    onSubmit(payload);
  };

  React.useEffect(() => {
    // 仅在模态框可见且表单已挂载时操作
    if (!visible) return;
    form.resetFields();
    form.setFieldsValue(formInitialValues);
  }, [formInitialValues, visible]);

  return (
    <Modal
      title={record ? '编辑热榜条目' : '新增热榜条目'}
      open={visible}
      onCancel={onCancel}
      footer={null}
      width={600}
      destroyOnClose
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={formInitialValues}
      >
        <Form.Item
          name="platform"
          label="平台"
          rules={[{ required: true, message: '请选择平台' }]}
        >
          <Select placeholder="选择平台">
            {platformOptions.slice(1).map(option => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          name="title"
          label="标题"
          rules={[{ required: true, message: '请输入标题' }]}
        >
          <Input placeholder="输入标题" />
        </Form.Item>
        <Form.Item
          name="url"
          label="链接"
          rules={[{ required: true, message: '请输入链接' }]}
        >
          <Input placeholder="输入链接URL" />
        </Form.Item>
        <Form.Item name="description" label="描述">
          <Input.TextArea placeholder="输入描述" rows={3} />
        </Form.Item>
        <Form.Item
          name="rank"
          label="排名"
          rules={[{ required: true, message: '请输入排名' }]}
        >
          <Input placeholder="输入排名，多个用逗号分隔" />
        </Form.Item>
        <Form.Item
          name="heat"
          label="热度"
          rules={[{ required: true, message: '请输入热度' }]}
        >
          <Input placeholder="输入热度，多个用逗号分隔" />
        </Form.Item>
        <Form.Item
          name="date"
          label="日期"
          rules={[{ required: true, message: '请选择日期' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {record ? '更新' : '创建'}
            </Button>
            <Button onClick={onCancel}>取消</Button>
          </Space>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default HotlistEntriesForm;