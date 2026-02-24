export type WorkplaceData = {
  user: {
    name: string;
    role: string;
    avatar: string;
  };
  stats: {
    projects: number;
    rank: number;
    visits: number;
  };
  projects: Array<{ name: string; description: string; updatedAt: string }>;
  activities: Array<{ id: string; content: string; time: string }>;
};

export const fetchWorkplace = async (): Promise<WorkplaceData> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: {
          name: '王宇',
          role: '前端负责人',
          avatar: 'https://api.dicebear.com/7.x/miniavs/svg?seed=work',
        },
        stats: {
          projects: 12,
          rank: 4,
          visits: 2846,
        },
        projects: [
          { name: 'Pro Dashboard', description: '企业级控制台模板', updatedAt: '1小时前' },
          { name: 'Marketing UI', description: '营销活动页组件库', updatedAt: '3小时前' },
          { name: 'HR Portal', description: '人事管理后台', updatedAt: '昨天 21:30' },
        ],
        activities: [
          { id: '1', content: '审核了 3 个设计稿', time: '10分钟前' },
          { id: '2', content: '合并了功能分支 release/1.4', time: '1小时前' },
          { id: '3', content: '安排了本周迭代计划', time: '昨天 18:00' },
        ],
      });
    }, 300);
  });
};
