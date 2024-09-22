import { DataTable } from "@/components/data-table";
import { Board } from "@/components/kanban";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TaskProvider } from "@/provider/TaskProvider";

export default function Page() {
  return (
    <section className="flex flex-col h-screen">
      <div className="flex flex-row justify-between items-center px-4 py-2">
        <h1 className="text-xl font-bold">Task Dashboard</h1>
      </div>
      <div className="flex flex-row h-full">
        <div className="flex flex-col w-3/4 px-4 py-2">
          <div className="mt-4">
            <h2 className="text-lg font-bold">Task List</h2>
            <TaskProvider>
              <Tabs defaultValue="table" className="">
                <TabsList className="">
                  <TabsTrigger value="table">Table</TabsTrigger>
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                </TabsList>
                <TabsContent value="table">
                  <DataTable />
                </TabsContent>
                <TabsContent value="kanban">
                  <Board />
                </TabsContent>
              </Tabs>
            </TaskProvider>
          </div>
        </div>
      </div>
    </section>
  );
}
