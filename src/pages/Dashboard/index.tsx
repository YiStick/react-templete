import { useRequest } from 'ahooks';
import { Avatar, Card, Col, List, Row, Space, Statistic, Typography } from 'antd';
import { fetchWorkplace } from '@/services/api/mock';

export default function Dashboard() {
  const { data, loading } = useRequest(fetchWorkplace);

  return (
    <Space direction="vertical" size={16} style={{ width: '100%' }}>
      <Card loading={loading}>
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar size={64} src={data?.user.avatar} />
          </Col>
          <Col flex="auto">
            <Typography.Title level={4} style={{ margin: 0 }}>
              早安，{data?.user.name}
            </Typography.Title>
            <Typography.Text type="secondary">{data?.user.role} · 工作台</Typography.Text>
          </Col>
          <Col>
            <Space size={24}>
              <Statistic title="项目数" value={data?.stats.projects} />
              <Statistic title="团队排名" value={data?.stats.rank} suffix="名" />
              <Statistic title="访问量" value={data?.stats.visits} />
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={16}>
        <Col span={16}>
          <Card title="项目进展" loading={loading}>
            <List
              itemLayout="horizontal"
              dataSource={data?.projects ?? []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.name}
                    description={item.description}
                  />
                  <Typography.Text type="secondary">{item.updatedAt}</Typography.Text>
                </List.Item>
              )}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="动态" loading={loading}>
            <List
              dataSource={data?.activities ?? []}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    title={item.content}
                    description={item.time}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </Space>
  );
}
