import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

// Authentication pages
const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/Customer/BookAjob/Home")));


// Freelance pages
const Post = Loadable(lazy(() => import("../pages/Customer/BookAjob/Post")));
const Sent = Loadable(lazy(() => import("../pages/Customer/BookAjob/Sent")));


// Postwork pages
const Postwork = Loadable(lazy(() => import("../pages/Freelance/Post")));
const EditWork = Loadable(lazy(() => import("../pages/Freelance/Post/edit")));
const CreateWork = Loadable(lazy(() => import("../pages/Freelance/Post/create")));

// Booking management pages
const Inpost = Loadable(lazy(() => import("../pages/Customer/BookAjob/Inpost")));
const Managebooking = Loadable(lazy(() => import("../pages/Customer/BookAjob/managebooking")));
const Getwork = Loadable(lazy(() => import("../pages/Customer/BookAjob/Getwork")));

const Booking = Loadable(lazy(() => import("../pages/Customer/BookAjob/Bookingwork")));


const Customer = Loadable(lazy(() => import("../pages/Customer/Profile/index")));

const EditCustomer = Loadable(lazy(() => import("../pages/Customer/Profile/edit/index")));

const ProfileCustomer = Loadable(lazy(() => import("../pages/Customer/Profile/profile/index")));

const Resume = Loadable(lazy(() => import("../pages/Freelance/Resume")));
const EditResume = Loadable(lazy(() => import("../pages/Freelance/Resume/edit")));
const ViewResume = Loadable(lazy(() => import("../pages/Freelance/Resume/view")));

const PaymentOptions = Loadable(lazy(() => import("../pages/Payment/options")));
const QR = Loadable(lazy(() => import("../pages/Payment/options/QRcode")));
const DebitCard = Loadable(lazy(() => import("../pages/Payment/options/DebitCard")));
const Rating = Loadable(lazy(() => import("../pages/Rating")));

const AdminRoutes = (isLoggedIn: boolean): RouteObject => {
    return {
        path: "/",
        element: isLoggedIn ? <FullLayout /> : <MainPages />,
        children: [
            {
                path: "/",
                element: <Dashboard />,
            },
            {
                path: "works",
                children: [
                    {
                        path: "",
                        element: <Post />,
                    },
                    {
                        path: ":workID/bookings",
                        element: <Managebooking />,
                    },
                    {
                        path: ":workID/track",
                        element: <Getwork />,
                    },
                ],
            },
            {
                path: "submissions",
                children: [
                    {
                        path: "",
                        element: <Getwork />,
                    },
                ],
            },
            {
                path: "bookingbyF",
                children: [
                    {
                        path: "",
                        element: <Booking />,
                    },
                ],
            },
            {
                path: "post/:postId/sent",
                element: <Sent />,
            },
            {
                path: "post/:postId",
                element: <Inpost />,
            },
            {

                path: "/customer",

                children: [

                    {

                        path: "/customer",

                        element: <Customer />,

                    },

                    {

                        path: "/customer/edit/:id",

                        element: <EditCustomer />,

                    },

                    {

                        path: "/customer/profile/:id",

                        element: <ProfileCustomer />,

                    },

                ],

            },

            {
                path: "work",
                children: [
                    {
                        path: "",
                        element: <Postwork />,
                    },
                    {
                        path: "create",
                        element: <CreateWork />,
                    },
                    {
                        path: "edit/:id",
                        element: <EditWork />,
                    },
                ],
            },
            {
                path: "/resume",
                children: [
                    {
                        path: "/resume",
                        element: <Resume />,
                    },
                    {
                        path: "/resume/edit/:id",
                        element: <EditResume />,
                    },
                    {
                        path: "/resume/view/:id",
                        element: <ViewResume />,
                    }
                ],
            },

            {
                path: "Rating",
                element: <Rating/>
            },
            {
                path: "payment",
                children: [
                    { path: "",element: <PaymentOptions />,},
                    { path: "QRcodePayment",element: <QR />},
                    { path: "DebitCardPayment",element: <DebitCard />}
                ]
            },


        ],
    };
};

export default AdminRoutes;
