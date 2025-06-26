import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface FormDataViewProps {
  formData: Record<string, any>
  formType: string
}

export default function FormDataView({ formData, formType }: FormDataViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Form Data</CardTitle>
        <CardDescription>View the data extracted from your {formType} form</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="extracted">
          <TabsList className="mb-4">
            <TabsTrigger value="extracted">Extracted Data</TabsTrigger>
            <TabsTrigger value="raw">Raw Data</TabsTrigger>
          </TabsList>

          <TabsContent value="extracted">
            <div className="border rounded-md overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Field</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {Object.entries(formData).map(([key, value]) => (
                    <tr key={key} className="bg-white">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {key
                          .replace(/([A-Z])/g, " $1")
                          .replace(/^./, (str) => str.toUpperCase())
                          .replace(/([a-z])([A-Z])/g, "$1 $2")}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{value as string}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </TabsContent>

          <TabsContent value="raw">
            <div className="bg-gray-50 p-4 rounded-md">
              <pre className="text-sm overflow-auto whitespace-pre-wrap">{JSON.stringify(formData, null, 2)}</pre>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
