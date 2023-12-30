import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "./ui/navigation-menu";

export const NavigationMenuComponent = () => {
  return (
    <NavigationMenu className="pt-4">
      <NavigationMenuList className="gap-3">
        <MenuLink>Pre-monei investments</MenuLink>
        <MenuLink>Categories</MenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

interface MenuLinkProps {
  active?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

const MenuLink = ({ active, onClick, children }: MenuLinkProps) => {
  return (
    <NavigationMenuItem
      className={`${
        active ? "text-black" : "text-gray-300"
      } font-medium transition-colors`}
    >
      <button onClick={onClick}>{children}</button>
    </NavigationMenuItem>
  );
};
