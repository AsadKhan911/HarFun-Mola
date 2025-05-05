import DS_COMP1 from './DS_COMP1';
import DS_COMP2 from './DS_COMP2';
import DS_COMP3 from './DS_COMP3';

const DashboardSummary = () => {
  return (
    <div className=" min-h-screen space-y-6">
      <DS_COMP1 />
      <DS_COMP2 />
      <DS_COMP3 />
    </div>
  );
};

export default DashboardSummary;
