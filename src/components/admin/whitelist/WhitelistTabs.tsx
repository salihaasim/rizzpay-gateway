
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IpWhitelistTable } from "./IpWhitelistTable";
import { WebhookWhitelistTable } from "./WebhookWhitelistTable";

export const WhitelistTabs = () => {
  const [activeTab, setActiveTab] = useState("ip");

  return (
    <Tabs defaultValue="ip" className="space-y-4" onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="ip">IP Whitelist</TabsTrigger>
        <TabsTrigger value="webhook">Webhook Domains</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ip" className="mt-4">
        <IpWhitelistTable />
      </TabsContent>
      
      <TabsContent value="webhook" className="mt-4">
        <WebhookWhitelistTable />
      </TabsContent>
    </Tabs>
  );
};
