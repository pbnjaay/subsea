import LastActivityItem from './last-activity-item';

const Last5Activities = ({ recentIssues }: { recentIssues: any[] }) => {
  return recentIssues.map((recent, i) => (
    <div className="flex flex-col space-y-2" key={i}>
      <LastActivityItem data={recent}></LastActivityItem>
    </div>
  ));
};

export default Last5Activities;
