
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IpWhitelistTable } from "./IpWhitelistTable";
import { WebhookWhitelistTable } from "./WebhookWhitelistTable";

export const WhitelistTabs = () => {
  return (
    <Tabs defaultValue="ip" className="space-y-4">
      <TabsList>
        <TabsTrigger value="ip">IP Whitelist</TabsTrigger>
        <TabsTrigger value="webhook">Webhook Domains</TabsTrigger>
      </TabsList>
      
      <TabsContent value="ip">
        <IpWhitelistTable />
      </TabsContent>
      
      <TabsContent value="webhook">
        <WebhookWhitelistTable />
      </TabsContent>
    </Tabs>
  );
};
