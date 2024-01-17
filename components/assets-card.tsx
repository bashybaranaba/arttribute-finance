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

export function AssetsCard() {
  return (
    <Card>
      <Tabs defaultValue="tokens">
        <CardHeader>
          <div className="flex">
            <CardTitle className="text-xl">Assets</CardTitle>
            <div className="grow" />
            <TabsList>
              <TabsTrigger value="tokens">Tokens</TabsTrigger>
              <TabsTrigger value="nfts">NFTs</TabsTrigger>
              <TabsTrigger value="supplied">Supplied</TabsTrigger>
            </TabsList>
          </div>
        </CardHeader>
        <CardContent>
          <TabsContent value="tokens">
            <div>
              <TokensTable />
            </div>
          </TabsContent>
          <TabsContent value="nfts">
            <div>NFTs</div>
          </TabsContent>
          <TabsContent value="supplied">
            <div>Supplied Assets</div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
}
