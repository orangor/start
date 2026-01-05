import React from 'react';
import Home from '../pages/Home';
import StatisticsAnalysis from '../pages/StatisticsPage';
import SettingsPage from '../pages/SettingsPage';
import Workflow from '../pages/Workflow';
import surveyData from '../routes/test.json';

export const BRAND = {
  name: 'Daydo',
  logo: '🌀',
} as const;

export type NavItem = {
  path: string;
  text: string;
  icon?: string;
  children?: Array<NavItem>;
};

export const NAV_ITEMS: NavItem[] = [
  { path: '/', text: '首页', icon: '' },
  {
    path: '/workflow',
    text: '工作流',
    icon: '',
    children: [
      { path: '/workflow/overview', text: '总览', icon: '' },
      { path: '/workflow/nodes', text: '节点', icon: '' },
    ],
  },
  { path: '/settings', text: '设置', icon: '' },
];

export type RouteConfig = {
  path: string;
  element: React.ReactNode;
  isProtected?: boolean;
};

export const ROUTES: RouteConfig[] = [
  { path: '/', element: <Home />, isProtected: true },
  { path: '/statistics', element: <StatisticsAnalysis data={surveyData} />, isProtected: true },
  { path: '/settings', element: <SettingsPage />, isProtected: true },
  { path: '/workflow', element: <Workflow />, isProtected: true },
];