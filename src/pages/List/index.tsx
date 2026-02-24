import { Button, Card, Space, Table, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';

type Item = {
  key: string;
  name: string;
  owner: string;
  status: '进行中' | '已完成' | '延期';
  updatedAt: string;
};

const dataSource: Item[] = [
  { key: '1', name: '营销活动页', owner: '赵敏', status: '进行中', updatedAt: '10:30' },
  { key: '2', name: '采购系统', owner: '李雷', status: '已完成', updatedAt: '昨天 19:20' },
  { key: '3', name: '财务工作台', owner: '王宇', status: '延期', updatedAt: '周一 09:00' },
];

export default function ListPage() {
  const navigate = useNavigate();
  const columns: ColumnsType<Item> = [
    { title: '项目名称', dataIndex: 'name' },
    { title: '负责人', dataIndex: 'owner', width: 120 },
    {
      title: '状态',
      dataIndex: 'status',
      width: 120,
      render: (value) => {
        const color = value === '已完成' ? 'green' : value === '延期' ? 'red' : 'blue';
        return <Tag color={color}>{value}</Tag>;
      },
    },
    { title: '更新时间', dataIndex: 'updatedAt', width: 160 },
    {
      title: '操作',
      dataIndex: 'actions',
      width: 200,
      render: (_, record) => (
        <Space size={8}>
          <Button type="link" size="small">
            编辑
          </Button>
          <Button type="link" size="small">
            删除
          </Button>
          <Button type="link" size="small" onClick={() => navigate(`/list/detail/${record.key}`)}>
            详情
          </Button>
        </Space>
      ),
    },
  ];
  return (
    <Card title="项目列表">
      <Table columns={columns} dataSource={dataSource} pagination={false} />
    </Card>
  );
}
