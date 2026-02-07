import { createFileRoute } from '@tanstack/react-router'
import { LinkagePage } from '@/components/services/mentoring/LinkagePage'

export const Route = createFileRoute('/account-linkage')({
    component: AccountLinkagePage,
})

function AccountLinkagePage() {
    return <LinkagePage />
}
