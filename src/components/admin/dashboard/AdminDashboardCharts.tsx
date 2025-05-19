
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Activity, BarChart3, PieChart, LineChart } from 'lucide-react';
import { 
  ComposedChart, 
  Line, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell
} from 'recharts';

// Sample data - in production, this would come from API calls
const transactionData = [
  { name: 'Jan', upi: 4000, card: 2400, netbanking: 1200, amt: 7600 },
  { name: 'Feb', upi: 3000, card: 1398, netbanking: 900, amt: 5298 },
  { name: 'Mar', upi: 5000, card: 3800, netbanking: 1700, amt: 10500 },
  { name: 'Apr', upi: 2780, card: 3908, netbanking: 2000, amt: 8688 },
  { name: 'May', upi: 7890, card: 4800, netbanking: 2181, amt: 14871 },
  { name: 'Jun', upi: 9390, card: 3800, netbanking: 2500, amt: 15690 },
];

const paymentMethodData = [
  { name: 'UPI', value: 48 },
  { name: 'Cards', value: 32 },
  { name: 'Net Banking', value: 12 },
  { name: 'Wallet', value: 8 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const AdminDashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
      <Card className="border border-border/50 shadow-sm xl:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Transaction Overview</CardTitle>
          <CardDescription>
            Month-to-date transaction performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart
              data={transactionData}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid stroke="#f5f5f5" />
              <XAxis dataKey="name" scale="band" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="amt" fill="#8884d8" stroke="#8884d8" />
              <Bar dataKey="upi" barSize={20} fill="#413ea0" />
              <Bar dataKey="card" barSize={20} fill="#ff7300" />
              <Line type="monotone" dataKey="netbanking" stroke="#ff0000" />
            </ComposedChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      
      <Card className="border border-border/50 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Payment Methods</CardTitle>
          <CardDescription>
            Distribution by payment type
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <RechartsPieChart>
              <Pie
                data={paymentMethodData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentMethodData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </RechartsPieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboardCharts;
