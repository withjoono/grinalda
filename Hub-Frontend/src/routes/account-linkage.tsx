import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/account-linkage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/account-linkage"!</div>
}
