import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from 'recharts';

const Overview = ({
  callId,
  plainte,
  instance,
  divers,
}: {
  callId: number;
  plainte: number;
  instance: number;
  divers: number;
}) => {
  const data = [
    {
      name: 'Call Id',
      total: callId,
    },
    {
      name: 'Claim',
      total: plainte,
    },
    {
      name: 'Instance',
      total: instance,
    },
    {
      name: 'Other',
      total: divers,
    },
  ];

  return (
    <>
      {data && (
        <ResponsiveContainer width="80%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}`}
            />
            <Bar dataKey="total" fill="#f97417" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </>
  );
};

export default Overview;
