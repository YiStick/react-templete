import { Button, Card, Descriptions, Space, Typography } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';

export default function ListDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  return (
    <Card
      title="列表详情"
      extra={
        <Button type="link" onClick={() => navigate('/list')}>
          返回列表
        </Button>
      }
    >
      <Space direction="vertical" size={12} style={{ width: '100%' }}>
        <Typography.Text type="secondary">当前详情页 ID</Typography.Text>
        <Descriptions bordered column={1} size="small">
          <Descriptions.Item label="ID">{id}</Descriptions.Item>
          <Descriptions.Item label="状态">进行中</Descriptions.Item>
          <Descriptions.Item label="负责人">赵敏</Descriptions.Item>
        </Descriptions>
      </Space>
    </Card>
  );
}
