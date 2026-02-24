import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select, Space, Switch } from 'antd';

const { TextArea } = Input;

const basicFields = [
  { name: 'fullName', label: '姓名', placeholder: '请输入姓名' },
  { name: 'nickname', label: '昵称', placeholder: '请输入昵称' },
  { name: 'position', label: '职位', placeholder: '请输入职位' },
  { name: 'department', label: '部门', placeholder: '请输入部门' },
  { name: 'company', label: '公司', placeholder: '请输入公司' },
  { name: 'phone', label: '手机号', placeholder: '请输入手机号' },
];

const accountFields = [
  { name: 'email', label: '邮箱', placeholder: '请输入邮箱' },
  { name: 'username', label: '用户名', placeholder: '请输入用户名' },
  { name: 'employeeId', label: '工号', placeholder: '请输入工号' },
  { name: 'role', label: '角色', placeholder: '请选择角色' },
  { name: 'status', label: '账号状态', placeholder: '请选择状态' },
  { name: 'joinDate', label: '入职日期', placeholder: '请选择日期' },
];

const addressFields = [
  { name: 'country', label: '国家', placeholder: '请选择国家' },
  { name: 'province', label: '省份', placeholder: '请选择省份' },
  { name: 'city', label: '城市', placeholder: '请选择城市' },
  { name: 'district', label: '区县', placeholder: '请选择区县' },
  { name: 'street', label: '街道', placeholder: '请输入街道' },
  { name: 'postal', label: '邮编', placeholder: '请输入邮编' },
];

const preferenceFields = [
  { name: 'theme', label: '主题', placeholder: '请选择主题' },
  { name: 'language', label: '语言', placeholder: '请选择语言' },
  { name: 'timezone', label: '时区', placeholder: '请选择时区' },
  { name: 'currency', label: '币种', placeholder: '请选择币种' },
  { name: 'unit', label: '单位', placeholder: '请选择单位' },
  { name: 'digest', label: '邮件摘要', placeholder: '请选择频率' },
];

const securityFields = [
  { name: 'passwordExpireDays', label: '密码有效期', placeholder: '请输入天数', type: 'number' },
  { name: 'loginRetries', label: '登录重试次数', placeholder: '请输入次数', type: 'number' },
  { name: 'sessionTimeout', label: '会话超时(分钟)', placeholder: '请输入分钟', type: 'number' },
  { name: 'ipWhitelist', label: 'IP 白名单', placeholder: '请输入 IP 列表', type: 'text' },
  { name: 'deviceLimit', label: '设备数量限制', placeholder: '请输入数量', type: 'number' },
  { name: 'backupContact', label: '备用联系方式', placeholder: '请输入联系方式', type: 'text' },
];

export default function LongForm() {
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="vertical"
      initialValues={{
        role: 'manager',
        status: 'active',
        theme: 'light',
        language: 'zh-CN',
        timezone: 'Asia/Shanghai',
        currency: 'CNY',
        unit: 'metric',
        digest: 'weekly',
        enableMfa: true,
        notifyEmail: true,
      }}
      onFinish={() => {}}
    >
      <Card title="基础信息" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {basicFields.map((field) => (
            <Col span={8} key={field.name}>
              <Form.Item name={field.name} label={field.label}>
                <Input placeholder={field.placeholder} />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Form.Item name="bio" label="个人简介">
          <TextArea rows={4} placeholder="请输入个人简介" />
        </Form.Item>
      </Card>

      <Card title="账号信息" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {accountFields.map((field) => {
            if (field.name === 'role') {
              return (
                <Col span={8} key={field.name}>
                  <Form.Item name={field.name} label={field.label}>
                    <Select
                      options={[
                        { value: 'admin', label: '管理员' },
                        { value: 'manager', label: '负责人' },
                        { value: 'staff', label: '成员' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              );
            }
            if (field.name === 'status') {
              return (
                <Col span={8} key={field.name}>
                  <Form.Item name={field.name} label={field.label}>
                    <Select
                      options={[
                        { value: 'active', label: '启用' },
                        { value: 'disabled', label: '停用' },
                        { value: 'locked', label: '锁定' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              );
            }
            if (field.name === 'joinDate') {
              return (
                <Col span={8} key={field.name}>
                  <Form.Item name={field.name} label={field.label}>
                    <DatePicker style={{ width: '100%' }} />
                  </Form.Item>
                </Col>
              );
            }
            return (
              <Col span={8} key={field.name}>
                <Form.Item name={field.name} label={field.label}>
                  <Input placeholder={field.placeholder} />
                </Form.Item>
              </Col>
            );
          })}
        </Row>
      </Card>

      <Card title="地址信息" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {addressFields.map((field) => (
            <Col span={8} key={field.name}>
              <Form.Item name={field.name} label={field.label}>
                <Input placeholder={field.placeholder} />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Form.Item name="addressDetail" label="详细地址">
          <TextArea rows={3} placeholder="请输入详细地址" />
        </Form.Item>
      </Card>

      <Card title="偏好设置" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {preferenceFields.map((field) => (
            <Col span={8} key={field.name}>
              <Form.Item name={field.name} label={field.label}>
                <Select
                  options={[
                    { value: 'light', label: '浅色' },
                    { value: 'dark', label: '深色' },
                    { value: 'auto', label: '跟随系统' },
                  ]}
                />
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="notifyEmail" label="邮件通知" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="notifySms" label="短信通知" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="notifyApp" label="应用内通知" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="安全配置" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {securityFields.map((field) => (
            <Col span={8} key={field.name}>
              <Form.Item name={field.name} label={field.label}>
                {field.type === 'number' ? (
                  <InputNumber style={{ width: '100%' }} placeholder={field.placeholder} />
                ) : (
                  <Input placeholder={field.placeholder} />
                )}
              </Form.Item>
            </Col>
          ))}
        </Row>
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="enableMfa" label="启用双因素" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="loginAlert" label="异常登录提醒" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="deviceNotify" label="新设备提醒" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item name="securityNotes" label="安全备注">
          <TextArea rows={4} placeholder="请输入安全备注" />
        </Form.Item>
      </Card>

      <Card title="补充信息" style={{ marginBottom: 16 }}>
        <Row gutter={16}>
          {Array.from({ length: 12 }).map((_, index) => (
            <Col span={8} key={`extra-${index}`}>
              <Form.Item name={`extraField${index + 1}`} label={`扩展字段 ${index + 1}`}>
                <Input placeholder={`请输入扩展字段 ${index + 1}`} />
              </Form.Item>
            </Col>
          ))}
        </Row>
      </Card>

      <Card>
        <Space>
          <Button type="primary" htmlType="submit">
            提交
          </Button>
          <Button onClick={() => form.resetFields()}>重置</Button>
        </Space>
      </Card>
    </Form>
  );
}
