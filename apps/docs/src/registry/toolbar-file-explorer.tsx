import {
  LayoutGridIcon,
  LayoutListIcon,
  MoreHorizontalIcon,
  SearchIcon,
  ShareIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Input,
  Toggle,
  ToggleGroup,
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarInput,
  ToolbarSeparator,
} from "@nui/core";

export default function ToolbarFileExplorerDemo() {
  return (
    <Toolbar>
      <ToggleGroup className="border-none bg-transparent p-0">
        <ToolbarButton
          size="icon"
          render={
            <Toggle aria-label="Grid view" value="grid-view">
              <LayoutGridIcon />
            </Toggle>
          }
        />
        <ToolbarButton
          size="icon"
          render={
            <Toggle aria-label="List view" value="list-view">
              <LayoutListIcon />
            </Toggle>
          }
        />
      </ToggleGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <ToolbarButton size="icon" variant="outline">
          <ShareIcon />
        </ToolbarButton>
        <DropdownMenu>
          <ToolbarButton
            size="icon"
            variant="outline"
            render={<DropdownMenuTrigger />}
          >
            <MoreHorizontalIcon />
          </ToolbarButton>
          <DropdownMenuContent>
            <DropdownMenuItem>New File</DropdownMenuItem>
            <DropdownMenuItem>New Folder</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Open in New Tab</DropdownMenuItem>
            <DropdownMenuItem>Get Info</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </ToolbarGroup>
      <ToolbarSeparator />

      <ToolbarInput
        render={<Input placeholder="Search" leadingIcon={<SearchIcon />} />}
      />
    </Toolbar>
  );
}
