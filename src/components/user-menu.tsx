import { signOut, useSession } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { ConfigIcon } from "./icon";

export const UserMenu = () => {
  const { data } = useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none">
        <ConfigIcon />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Hi {data?.user.name}!</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem className="cursor-pointer">
          Pre-monei investments
        </DropdownMenuItem> */}
        <DropdownMenuItem
          className="cursor-pointer text-red-500 focus:text-red-500"
          onClick={() => void signOut()}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
