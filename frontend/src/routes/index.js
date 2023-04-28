import SensorHistory from "../pages/CustomerPages/Lich_Su_Hoat_Dong/SensorHistory.jsx";
import SensorInfoPage from "../pages/CustomerPages/Thong_Tin_Cam_Bien/SensorInfoPage.jsx";
import NotificationPage from "../pages/CustomerPages/Thong_Bao/NotificationPage.jsx";
import GardenList from "../pages/CustomerPages/GardenList/GardenList"
import LoginAs from "../pages/AuthorizationPages/LoginAs/LoginAs";
import Login from "../pages/AuthorizationPages/Login/Login"
import PassRetrival from "../pages/AuthorizationPages/PassRetrival/PassRetrival";
import Register from "../pages/AuthorizationPages/Register/Register";
import GardenDetail from "../pages/CustomerPages/GardenDetail/GardenDetail";
import GardenRegis from "../pages/CustomerPages/GardenRegis/GardenRegis";
import GardenModify from "../pages/CustomerPages/GardenModify/GardenModify";

import StatisticPage from "../pages/CustomerPages/Thong_Ke_Lich_SU/StatisticPage.jsx";


import GardenDashboard from "../pages/CustomerPages/GardenDashboard/GardenDashboard";
import ManageSensorPage from "../pages/CustomerPages/ManageSensor/ManageSensorPage";
import InputValue from "../pages/CustomerPages/InputValue/InputValue";
import ManageUser from "../pages/AdminPages/ManageUser/ManageUser.jsx";
import ManageRequest from "../pages/AdminPages/ManageRequest/ManageRequest.jsx";
import ControlPump from "../pages/CustomerPages/ControlPump/ControlPump";
import Schedule from "../pages/CustomerPages/Schedule/Schedule.jsx";
import NavigateCus from "../pages/CustomerPages/NavigateCus/NavigateCus.jsx";

// Tech part 
import Search from "../pages/TechnicianPages/SearchUser/Search.jsx"
import GardenLst from "../pages/TechnicianPages/GardenLst/GardenLst.jsx"
import DeviceType from "../pages/TechnicianPages/DeviceType/DeviceType.jsx"
import ManageDevice from "../pages/TechnicianPages/ManageDevice/ManageDevice.jsx"
const routes = [
    //Navigate page
    {path: '/', component: NavigateCus},
    //Authorize
    { path: '/login-as', component: LoginAs },
    { path: '/login/:role', component: Login },
    { path: '/pass-retri', component: PassRetrival },
    { path: '/register', component: Register },
    //Customer
    { path: '/:account', component: GardenList },
    { path: '/:account/garden-detail/:id', component: GardenDetail },

    {path: '/:account/garden-regis', component: GardenRegis},
    {path: '/:account/garden-mod/:id', component: GardenModify},

    { path: '/:account/SensorHistory/:garden_id', component: SensorHistory },
    { path: '/:account/SensorInfoPage/:garden_id', component: SensorInfoPage },
    { path: '/:account/NotificationPage', component: NotificationPage },
    { path: '/:account/SensorHistory/:garden_id/:device_id', component: StatisticPage },


    { path: '/:account/dashboard/:garden_id', component: GardenDashboard },
    { path: '/:account/InputValue/:garden_id', component: InputValue },
    { path: '/:account/ManageSensor', component: ManageSensorPage },
    { path: '/:account/controlPump/:garden_id', component: ControlPump },
    { path: '/:account/schedule/:garden_id', component: Schedule },
    { path: '/admin', component: ManageUser },
    { path: '/admin/request', component: ManageRequest },
    // Technician part
    { path: '/tech', component: Search },
    { path: '/tech/:account', component: GardenLst },
    { path: '/tech/:account/:gar_id', component: DeviceType },
    { path: '/tech/:account/:gar_id/:device_type', component: ManageDevice }
]

export default routes;
