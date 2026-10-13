import { createBrowserRouter } from "react-router";

import { CustomerLayout } from "@/components/layout/CustomerLayout";
import { StaffLayout } from "@/components/layout/StaffLayout";

import Frontpage from "@/pages/customer/Frontpage";
import Menupage from "@/pages/customer/Menupage";
//import TableOverview from "@/pages/waiter/TableOverview";
//import NewOrder from "@/pages/waiter/MewOrder";
//import Order from "@/pages/waiter/Order";
import PizzaScreen from "@/pages/kitchen/PizzaScreen";
//import GrillScreen from "@/pages/kitchen/GrillScreen";
//import Reservation from "@/pages/admin/reservations";
//import MenuEdit from "@/pages/admin/MenuEdit";
import NotFound from "@/pages/NotFound";

export const router = createBrowserRouter([
    {
        // Customer site: public, mobile-friendly
        path: "/",
        element: <CustomerLayout />,
        children: [
            { index: true, element: <Frontpage /> }, // "/"
            { path: "menu", element: <Menupage /> }, // "/menu"
        ]
    },
    {
        // Waiter: tablet
        path: "/waiter",
        element: <StaffLayout title="Tjener" />,
        children: [
            //{ index: true, element: <NewOrder /> }, // "/waiter"
            //{ path: "tables/:tableNumber/new-order", element: <NewOrder /> },
            //{ path: "orders/:orderId", element: <Order /> },
            //{ path: "reservations", element: <Reservations /> }, // Waiters, register phone bookings
        ],
    },
    {
        // Kitchen: full-screen, no nav on purpose
        path: "/pizza-kitchen",
        element: <PizzaScreen />
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