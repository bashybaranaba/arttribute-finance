"use client";
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TokensTable } from "./tokens-table";

export function BorrowCard() {
  return (
    <Card>
      <Tabs defaultValue="available">
        <CardHeader>
          <div className="flex">
            <CardTitle className="text-xl">Borrow</CardTitle>
            <div className="grow" />
            <TabsList>
              <TabsTrigger value="available">Available</TabsTrigger>
              <TabsTrigger value="borrowed">Borrowed</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="available">
            <div>
              <TokensTable />
            </div>
          </TabsContent>
          <TabsContent value="borrowed">
            <div>Borrowed</div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
