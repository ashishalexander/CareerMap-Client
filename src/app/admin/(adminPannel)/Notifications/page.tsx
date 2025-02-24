
import { Metadata } from "next"
import NotificationCreator from "./NotificationCreator"

export const metadata: Metadata = {
  title: "Notifications | Admin Dashboard",
  description: "Create and send notifications to users",
}

export default function NotificationsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="grid gap-4">
        <NotificationCreator />
      </div>
    </div>
  )
}