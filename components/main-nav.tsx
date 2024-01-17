import Link from "next/link";

import { cn } from "@/lib/utils";
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      <Menubar className="rounded-none border-b border-none px-2 lg:px-4">
        <MenubarMenu>
          <MenubarTrigger className="text-sm ">About</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              {" "}
              <Link href="/" passHref>
                About Arttribute
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <Link href="/" passHref>
                {" "}
                Arttribute Licences
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-sm ">Artists</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              {" "}
              <Link href="/studio" passHref>
                Studio
              </Link>
            </MenubarItem>
            {/* <MenubarSeparator />
            <MenubarItem>
              <Link href="/" passHref>
                {" "}
                Arttribute Licences
              </Link>
            </MenubarItem> */}
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-sm ">Builders</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              <Link
                href="https://docs.arttribute.io/"
                rel="noopener noreferrer"
                target="_blank"
              >
                {" "}
                Arttribute API
              </Link>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              {" "}
              <Link href="/" passHref>
                Build with Arttribute
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger className="text-sm ">NFTs</MenubarTrigger>
          <MenubarContent>
            <MenubarItem>
              {" "}
              <Link href="/" passHref>
                Marketplace Coming soon..
              </Link>
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
    </nav>
  );
}
