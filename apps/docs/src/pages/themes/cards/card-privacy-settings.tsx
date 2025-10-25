import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Label,
  Switch,
} from "@nui/core";

const settings = [
  {
    id: "public-profile",
    title: "Public Profile",
    description: "Make your profile visible to everyone",
  },
  {
    id: "show-email",
    title: "Show Email",
    description: "Allow others to see your email address",
  },
  {
    id: "show-activity",
    title: "Activity Status",
    description: "Show when you're active on the platform",
  },
  {
    id: "read-receipts",
    title: "Read Receipts",
    description: "Let others know when you've read their messages",
  },
  {
    id: "search-visibility",
    title: "Search Visibility",
    description: "Allow others to find you in search results",
  },
];

export function PrivacySettingsCard() {
  return (
    <Card className="size-full">
      <CardHeader>
        <CardTitle>Privacy Settings</CardTitle>
        <CardDescription>
          Control your privacy settings to customize your profile visibility and
          communication preferences.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {settings.map((setting) => (
          <div
            key={setting.id}
            className="flex items-center justify-between space-x-4"
          >
            <Label
              htmlFor={setting.id}
              className="flex w-full items-center justify-between gap-x-2"
            >
              <div className="flex-1 space-y-1 text-sm">
                {setting.title}
                <p className="text-muted-foreground">{setting.description}</p>
              </div>
              <Switch id={setting.id} />
            </Label>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
