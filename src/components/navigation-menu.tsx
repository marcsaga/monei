import {
  NavigationMenu as UiNavigationMenu,
  NavigationMenuLink,
  NavigationMenuList,
} from "./ui/navigation-menu";
import { useRouter } from "next/router";

interface NavigationMenuProps {
  className?: string;
  items: { name: string; linkBase: string; linkSuffix?: string }[];
}

export const NavigationMenu = ({ className, items }: NavigationMenuProps) => {
  return (
    <UiNavigationMenu className={className}>
      <NavigationMenuList className="gap-3">
        {items.map(({ name, linkBase, linkSuffix = "" }) => (
          <MenuLink
            key={linkBase}
            href={linkBase + linkSuffix}
            linkBase={linkBase}
          >
            {name}
          </MenuLink>
        ))}
      </NavigationMenuList>
    </UiNavigationMenu>
  );
};

interface MenuLinkProps {
  linkBase: string;
  href: string;
  children: React.ReactNode;
}

const MenuLink = ({ href, children, linkBase }: MenuLinkProps) => {
  const router = useRouter();
  return (
    <NavigationMenuLink
      href={href}
      className={`${
        router.pathname.includes(linkBase)
          ? "text-main-dark"
          : "text-main-dark text-opacity-20"
      } whitespace-nowrap font-medium transition-colors`}
    >
      {children}
    </NavigationMenuLink>
  );
};
