import { createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/ms/dashboard')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/ms/dashboard"!</div>
}
