import { Button, Card, Form, Input, Space } from 'antd';

export default function Profile() {
  return (
    <Card title="个人信息">
      <Form layout="vertical" style={{ maxWidth: 520 }}>
        <Form.Item label="姓名" name="name" initialValue="王宇">
          <Input placeholder="请输入姓名" />
        </Form.Item>
        <Form.Item label="职位" name="role" initialValue="前端负责人">
          <Input placeholder="请输入职位" />
        </Form.Item>
        <Form.Item label="邮箱" name="email" initialValue="wangyu@example.com">
          <Input placeholder="请输入邮箱" />
        </Form.Item>
        <Space>
          <Button type="primary">保存</Button>
          <Button>重置</Button>
        </Space>
      </Form>
    </Card>
  );
}
