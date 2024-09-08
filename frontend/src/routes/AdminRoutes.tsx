import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

// Authentication pages
const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/Customer/BookAjob/Home")));

// Resume pages
const ResumeList = Loadable(lazy(() => import("../pages/Resume")));
const PersonalCreate = Loadable(lazy(() => import("../pages/Resume/create/personal")));
const StudyCreate = Loadable(lazy(() => import("../pages/Resume/create/study")));
const ExperienceCreate = Loadable(lazy(() => import("../pages/Resume/create/experience")));
const SkillCreate = Loadable(lazy(() => import("../pages/Resume/create/skill")));

// Edit Resume pages
const PersonalEdit = Loadable(lazy(() => import("../pages/Resume/edit/personal")));
const StudyEdit = Loadable(lazy(() => import("../pages/Resume/edit/study")));
const ExperienceEdit = Loadable(lazy(() => import("../pages/Resume/edit/experience")));
const SkillEdit = Loadable(lazy(() => import("../pages/Resume/edit/skill")));

// Freelance pages
const Post = Loadable(lazy(() => import("../pages/Customer/BookAjob/Post")));
const Promiss = Loadable(lazy(() => import("../pages/Customer/BookAjob/Promiss")));
const Sent = Loadable(lazy(() => import("../pages/Customer/BookAjob/Sent")));
const Getmon = Loadable(lazy(() => import("../pages/Customer/BookAjob/Getmoney")));

const Postwork = Loadable(lazy(() => import("../pages/Freelance/Post")));
const EditWork = Loadable(lazy(() => import("../pages/Freelance/Post/edit")));
const CreateWork = Loadable(lazy(() => import("../pages/Freelance/Post/create")));

// Booking management pages
const Inpost = Loadable(lazy(() => import("../pages/Customer/BookAjob/Inpost")));
const Managebooking = Loadable(lazy(() => import("../pages/Customer/BookAjob/managebooking")));
const BookingDetail = Loadable(lazy(() => import("../pages/Customer/BookAjob/BookingDetail")));

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
                path: "resume",
                children: [
                    {
                        path: "",
                        element: <ResumeList />,
                    },
                    {
                        path: "create",
                        children: [
                            {
                                path: "personal",
                                element: <PersonalCreate />,
                            },
                            {
                                path: "study",
                                element: <StudyCreate />,
                            },
                            {
                                path: "experience",
                                element: <ExperienceCreate />,
                            },
                            {
                                path: "skill",
                                element: <SkillCreate />,
                            },
                        ],
                    },
                    {
                        path: "edit",
                        children: [
                            {
                                path: "personal",
                                element: <PersonalEdit />,
                            },
                            {
                                path: "study",
                                element: <StudyEdit />,
                            },
                            {
                                path: "experience",
                                element: <ExperienceEdit />,
                            },
                            {
                                path: "skill",
                                element: <SkillEdit />,
                            },
                        ],
                    },
                ],
            },
            {
                path: "post",
                element: <Post />,
            },
            {
                path: "promiss",
                element: <Promiss />,
            },
            {
                path: "sent",
                element: <Sent />,
            },
            {
                path: "getmon",
                element: <Getmon />,
            },
            {
                path: "post/:postId",
                element: <Inpost />,
            },
            // {
            //     path: "work/:postId/managebooking",
            //     element: <Managebooking />,
            // },
            // {
            //     path: "booking/:bookingId",
            //     element: <BookingDetail />,
            // },
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
                    // {
                    //     path: ":postId/managebooking", // เพิ่มเส้นทางนี้
                    //     element: <Managebooking />,
                    // },
                ],
            },
        ],
    };
};

export default AdminRoutes;