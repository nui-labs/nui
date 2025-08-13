import { AuthCard } from "./cards/card-auth";
import { CalendarCard } from "./cards/card-calendar";
import { ChatCard } from "./cards/card-chat";
import { FeedbackCard } from "./cards/card-feedback";
import { ManageMembersCard } from "./cards/card-manage-members";
import { OTPCard } from "./cards/card-otp";
import { PrivacySettingsCard } from "./cards/card-privacy-settings";
import { TableCard } from "./cards/card-table";
import { VisitorsChartCard } from "./cards/card-visitors-chart";

export function CardsGrid() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <VisitorsChartCard />
        <ManageMembersCard />
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[260px_auto] lg:grid-cols-[260px_1fr_1fr]">
        <CalendarCard />
        <FeedbackCard />
        <div className="md:col-span-2 lg:col-span-1">
          <OTPCard />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[380px_auto]">
        <div className="order-2 grid grid-cols-1 gap-4 md:grid-cols-2 lg:order-1 lg:grid-cols-1">
          <AuthCard />
          <div className="min-h-[400px] lg:hidden">
            <ChatCard />
          </div>
        </div>
        <div className="order-1 overflow-hidden lg:order-2">
          <TableCard />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="hidden lg:block">
          <ChatCard />
        </div>
        <PrivacySettingsCard />
      </div>
    </div>
  );
}
