/**
 * /planner/daily 라우트
 * 
 * /planner/today로 리다이렉트합니다.
 */

import { createLazyFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/planner/daily')({
  component: () => <Navigate to="/planner/today" />,
})
