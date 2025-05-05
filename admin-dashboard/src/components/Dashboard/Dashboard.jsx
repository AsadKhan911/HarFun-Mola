import React from 'react'
import Sidebar from './SideBar'
import DashboardSummary from './DashboardSummary'

const Dashboard = () => {
  return (
    <Sidebar>
      <DashboardSummary />
    </Sidebar>
  )
}

export default Dashboard