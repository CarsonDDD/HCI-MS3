import React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import QueryStatsIcon from '@mui/icons-material/QueryStats';

export const SidebarData=
[
    {
        title:"Home",
        icon:<HomeIcon/>,
        link:"/home"
    },
    {
        title:"Calendar",
        icon:<CalendarTodayIcon/>,
        link:"/calendar"
    },
    {
        title:"Stats",
        icon:<QueryStatsIcon/>,
        link:"/stats"
    },

];

