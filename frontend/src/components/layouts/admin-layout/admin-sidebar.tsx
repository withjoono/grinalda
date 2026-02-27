'use client';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { Logo } from '@/components/ui/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sidebar as SidebarContainer,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { AdminSidebarConfig } from '@/constants/admin-sidebar-config';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect } from 'react';

export default function AdminSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, isMobile } = useSidebar();

  useEffect(() => {
    if (isMobile) toggleSidebar();
  }, [pathname, isMobile, toggleSidebar]);

  return (
    <SidebarContainer collapsible='icon'>
      <SidebarHeader className='h-16 items-center justify-center'>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <Logo className='me-2 group-data-[collapsible=icon]:me-0' />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className='overflow-hidden'>
        <ScrollArea>
          {AdminSidebarConfig.map((route, key) => (
            <SidebarGroup key={key}>
              <SidebarGroupLabel>{route.title}</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {route.items.map((item, key) => (
                    <SidebarMenuItem key={key}>
                      {item.items?.length ? (
                        <Collapsible className='group/collapsible'>
                          <CollapsibleTrigger asChild>
                            <SidebarMenuButton tooltip={item.title}>
                              {item.icon && <item.icon className='h-4 w-4' />}
                              <span>{item.title}</span>
                              <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                            </SidebarMenuButton>
                          </CollapsibleTrigger>
                          <CollapsibleContent>
                            <SidebarMenuSub>
                              {item.items.map((subItem, key) => (
                                <SidebarMenuSubItem key={key}>
                                  <SidebarMenuSubButton
                                    isActive={pathname === subItem.href}
                                    asChild
                                  >
                                    <Link
                                      href={subItem.href}
                                      target={subItem.newTab ? '_blank' : ''}
                                    >
                                      {subItem.icon && (
                                        <subItem.icon className='size-4' />
                                      )}
                                      <span>{subItem.title}</span>
                                    </Link>
                                  </SidebarMenuSubButton>
                                </SidebarMenuSubItem>
                              ))}
                            </SidebarMenuSub>
                          </CollapsibleContent>
                        </Collapsible>
                      ) : (
                        <SidebarMenuButton
                          asChild
                          tooltip={item.title}
                          isActive={pathname === item.href}
                        >
                          <Link
                            href={item.href}
                            target={item.newTab ? '_blank' : ''}
                          >
                            {item.icon && <item.icon className='size-4' />}
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      )}
                      {item.isComing ? (
                        <SidebarMenuBadge className='opacity-50'>
                          Coming
                        </SidebarMenuBadge>
                      ) : null}
                      {item.isNew ? (
                        <SidebarMenuBadge className='text-green-500 dark:text-green-200'>
                          New
                        </SidebarMenuBadge>
                      ) : null}
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ))}
        </ScrollArea>
      </SidebarContent>
    </SidebarContainer>
  );
}
