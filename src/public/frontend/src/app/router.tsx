import { createBrowserRouter, Navigate } from "react-router";

import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { StaffLayout } from "@/components/layout/StaffLayout";

import Frontpage from "@/pages/customer/Frontpage";
import Menupage from "@/pages/customer/Menupage";
//import TableOverview from "@/pages/waiter/TableOverview";
//import NewOrder from "@/pages/waiter/MewOrder";
//import Order from "@/pages/waiter/Order";
import PizzaScreen from "@/pages/kitchen/PizzaScreen";
import GrillScreen from "@/pages/kitchen/GrillScreen";
import OverviewScreen from "@/pages/kitchen/OverviewScreen";
//import Reservation from "@/pages/admin/reservations";
//import MenuEdit from "@/pages/admin/MenuEdit";
import LogInPage from "@/pages/admin/LogIn";
import NotFound from "@/pages/NotFound";
import WaiterPage from "@/pages/waiter/WaiterPage";

export const router = createBrowserRouter([
    {
        // Customer site: public, mobile-friendly
        path: "/",
        element: <CustomerLayout />,
        children: [
            { index: true, element: <Frontpage /> }, // "/"
            { path: "menu", element: <Menupage /> }, // "/menu"
            { path: "login", element: <LogInPage /> }, // "/login"
        ]
    },
    {
        // Waiter: tablet
        path: "/waiter",
        element: <StaffLayout title="Tjener" />,
        children: [
            {index: true, element: <WaiterPage /> }, // "/waiter"
            //{ index: true, element: <NewOrder /> }, // "/waiter"
            //{ path: "tables/:tableNumber/new-order", element: <NewOrder /> },
            //{ path: "orders/:orderId", element: <Order /> },
            //{ path: "reservations", element: <Reservations /> }, // Waiters, register phone bookings
        ],
    },
    {
        path: "/kitchen",
        element: <StaffLayout title="Køkken" />,
        children: [
            {index: true, element: <Navigate to="overview" replace />},
            {path: "overview", element: <OverviewScreen />},
            {path: "pizza", element: <PizzaScreen />},
            {path: "grill", element: <GrillScreen />}
        ]
    },
    {
        // Owner/admin
        //path: "/admin",
        //element: <StaffLayout title="Admin"/>,
        //children: [
        //    { index: true, element: <Reservations /> },
        //    { path: "menu", element: <MenuEdit /> },
        //],
    },
    { path: "*", element: <NotFound /> },
]);