import { lazy } from "react";
import { RouteObject } from "react-router-dom";
import Loadable from "../components/third-patry/Loadable";
import FullLayout from "../layout/FullLayout";

const MainPages = Loadable(lazy(() => import("../pages/authentication/Login")));
const Dashboard = Loadable(lazy(() => import("../pages/Customer/BookAjob/Home")));
//ของเพื่อนต้อง Resume
const ResumeList = Loadable(lazy(() => import("../pages/Resume")));
// const Customer = Loadable(lazy(() => import("../pages/Customer/BookAjob/customer")));
const PersonalCreate = Loadable(lazy(() => import("../pages/Resume/create/personal")));
const StudyCreate = Loadable(lazy(() => import("../pages/Resume/create/study")));
const ExperienceCreate = Loadable(lazy(() => import("../pages/Resume/create/experience")));
const SkillCreate = Loadable(lazy(() => import("../pages/Resume/create/skill")));

// Import the new edit components
const PersonalEdit = Loadable(lazy(() => import("../pages/Resume/edit/personal")));
const StudyEdit = Loadable(lazy(() => import("../pages/Resume/edit/study")));
const ExperienceEdit = Loadable(lazy(() => import("../pages/Resume/edit/experience")));
const SkillEdit = Loadable(lazy(() => import("../pages/Resume/edit/skill")));

// const CreateCustomer = Loadable(lazy(() => import("../pages/customer/create")));
// const EditCustomer = Loadable(lazy(() => import("../pages/customer/edit")));
const Post = Loadable(lazy(() => import("../pages/Customer/BookAjob/Post")));
const Promiss = Loadable(lazy(() => import("../pages/Customer/BookAjob/Promiss")));
const Sent = Loadable(lazy(() => import("../pages/Customer/BookAjob/Sent")));
// const UnSent = Loadable(lazy(() => import("../pages/dashboard")));
const Getmon = Loadable(lazy(() => import("../pages/Customer/BookAjob/Getmoney")));
const Postjob = Loadable(lazy(() => import("../pages/Customer/Post/Postjob")));

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
                path: "postjob",
                element: <Postjob />,
            },
        ],
    };
};


export default AdminRoutes;
